import { supabase } from '../lib/supabase';
import axios from 'axios';
import { trackOfferClick, trackOfferImpression, TrackingEventType, TrackingParams } from '../lib/offer18';

const BASE_URL = 'https://www.cpagrip.com';
const TRACKING_DOMAIN = 'motifiles.com';
const USER_ID = '43957';
const PUBLIC_KEY = '6641304862927940f9fc6973e2459084';

// Helper function to generate UUID using Web Crypto API
function generateUUID() {
  return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export interface OfferItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category: string;
  reward: string;
  country: string;
  conversion: string;
  type: string;
  photo: string;
  points: number;
  difficulty?: 'Easy' | 'Medium';
  offer_id?: string;
}

interface OfferFeedOptions {
  trackingId?: string;
  limit?: number;
  showMobile?: boolean | 'only';
  showAll?: boolean;
  country?: string;
  offerType?: string;
  lockerId?: string;
  ip?: string;
}

const getUserIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    return null;
  }
};

const getUserAgent = () => {
  return navigator.userAgent;
};

const sanitizeString = (value: any): string => {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const sanitizeNumber = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const getOfferImage = (offer: any): string => {
  if (offer.offerphoto && offer.offerphoto.startsWith('http')) {
    return offer.offerphoto;
  }
  
  if (offer.media_id) {
    return `${BASE_URL}/admin/media/offers/${offer.media_id}.png`;
  }
  
  if (offer.preview_url && offer.preview_url.startsWith('http')) {
    return offer.preview_url;
  }
  
  return 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=800&q=80';
};

const extractOfferId = (link: string): string => {
  if (!link) return '';
  
  try {
    // Extract ID from motifiles.com URL format
    const idMatch = link.match(/[?&]id=(\d+)/);
    if (idMatch) return idMatch[1];

    // Try to extract from query parameters
    const url = new URL(link);
    const offerId = url.searchParams.get('offer_id');
    if (offerId) return offerId;

    return '';
  } catch (error) {
    // If URL parsing fails, try direct regex
    const idMatch = link.match(/[?&]id=(\d+)/);
    return idMatch ? idMatch[1] : '';
  }
};

const validateOffer = (offer: any): boolean => {
  // Required fields must be present and non-empty
  if (!offer.title || !offer.description || !offer.offerlink) {
    return false;
  }

  // Reward must be a positive number
  const reward = sanitizeNumber(offer.payout);
  if (reward <= 0) {
    return false;
  }

  return true;
};

// Update the getDifficulty function
const getDifficulty = (conversion: string): 'Easy' | 'Medium' => {
  const convRate = parseFloat(conversion);
  return convRate > 0.3 ? 'Easy' : 'Medium';
};

export const formatPoints = (points: number): string => {
  return new Intl.NumberFormat().format(points);
};

export const trackOfferClickEvent = async (
  userId: string,
  offerId: string,
  offerTitle: string,
  reward: number,
  originalLink: string,
  deviceInfo: any,
  category: string,
  points: number
) => {
  try {
    // Generate unique IDs
    const clickId = generateUUID();
    const trackingId = `track_${Date.now()}_${generateUUID().split('-')[0]}`;

    // Create click record
    const { error } = await supabase.from('offer_clicks').insert({
      id: clickId,
      user_id: userId,
      offer_id: offerId,
      offer_title: offerTitle,
      offer_type: category,
      reward,
      clicked_at: new Date().toISOString(),
      original_link: originalLink,
      status: 'clicked',
      tracking_id: trackingId,
      device_info: deviceInfo,
      category,
      points,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error creating click record:', error);
      throw error;
    }

    // Track click event
    await trackOfferClick(offerId, clickId, {
      user_id: userId,
      aff_sub: trackingId,
      custom_data: {
        offer_title: offerTitle,
        reward: reward,
        category: category
      }
    });

    // Generate postback URL using window.location.origin
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cashiollav1.netlify.app';
    const postbackUrl = `${baseUrl}/api/postback?click_id=${clickId}&offer_id=${offerId}&tracking_id=${trackingId}`;

    return {
      success: true,
      clickId,
      trackingId,
      postbackUrl,
      originalLink
    };

  } catch (error) {
    console.error('Error in trackOfferClickEvent:', error);
    throw error;
  }
};

export const fetchOffers = async (options: OfferFeedOptions = {}): Promise<OfferItem[]> => {
  try {
    const userIp = await getUserIP();
    const userAgent = getUserAgent();

    const params = new URLSearchParams({
      user_id: USER_ID,
      pubkey: PUBLIC_KEY,
      format: 'json',
      ua: encodeURIComponent(userAgent),
      ip: options.ip || userIp || '',
      ...(options.trackingId && { tracking_id: options.trackingId }),
      ...(options.limit && { limit: options.limit.toString() }),
      ...(options.showMobile && { 
        showmobile: options.showMobile === 'only' ? 'only' : 'yes'
      }),
      ...(options.country && { country: options.country }),
      ...(options.offerType && { offer_type: options.offerType }),
      ...(options.lockerId && { lid: options.lockerId })
    });

    const response = await axios.get(`${BASE_URL}/common/offer_feed_json.php?${params.toString()}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.data || !response.data.offers) {
      return [];
    }

    const offers = response.data.offers
      .filter((offer: any) => validateOffer(offer))
      .map((offer: any) => {
        const reward = sanitizeNumber(offer.payout);
        const offerId = extractOfferId(offer.offerlink);
        const conversion = sanitizeString(offer.conversion);
        
        return {
          title: sanitizeString(offer.title),
          description: sanitizeString(offer.description),
          link: offer.offerlink.replace('www.cpagrip.com', TRACKING_DOMAIN),
          pubDate: sanitizeString(offer.date_added),
          category: sanitizeString(offer.category),
          reward: reward.toFixed(2),
          country: sanitizeString(offer.country),
          conversion,
          type: sanitizeString(offer.type) || 'Other',
          photo: getOfferImage(offer),
          points: Math.floor(reward * 100),
          difficulty: getDifficulty(conversion),
          offer_id: offerId
        };
      })
      .filter((offer: OfferItem) => offer.offer_id && offer.link);
      
    // Track impressions for all offers - wrapped in try/catch to prevent errors
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        offers.forEach(function(offer: OfferItem) {
          if (offer.offer_id) {
            try {
              trackOfferImpression(offer.offer_id, {
                user_id: user.id,
                custom_data: {
                  offer_title: offer.title,
                  offer_type: offer.type,
                  reward: offer.reward
                }
              });
            } catch (error) {
              // Silently fail impression tracking to not disrupt the user experience
              console.warn('Failed to track offer impression:', error);
            }
          }
        });
      }
    } catch (error) {
      console.warn('Failed to track offer impressions:', error);
    }
    
    return offers;
  } catch (error) {
    return [];
  }
};

export const categorizeOffers = (offers: OfferItem[]): Record<string, OfferItem[]> => {
  return offers.reduce((acc, offer) => {
    const category = offer.type || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(offer);
    return acc;
  }, {} as Record<string, OfferItem[]>);
};

export const calculateEarningPotential = (offers: OfferItem[]): number => {
  return offers.reduce((total, offer) => {
    return total + sanitizeNumber(offer.reward);
  }, 0);
};

export const getDeviceType = (): 'mobile' | 'desktop' => {
  const userAgent = navigator.userAgent || navigator.vendor;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(userAgent.substr(0, 4))) {
    return 'mobile';
  }
  return 'desktop';
};

export const getOptimalOfferSettings = async (): Promise<OfferFeedOptions> => {
  const deviceType = getDeviceType();
  const userIp = await getUserIP();
  
  return {
    showMobile: deviceType === 'mobile' ? 'only' : false,
    limit: 100,
    showAll: true,
    ip: userIp || undefined,
  };
};