import { supabase } from '../lib/supabase';

export interface PostbackData {
  click_id: string;
  status: string;
  payout?: number;
  offer_id?: string;
  tracking_id?: string;
  password?: string;
  ip_address?: string;
  user_agent?: string;
  raw_data?: any;
}

const POSTBACK_PASSWORD = '7839877';
const POSTBACK_DOMAIN = 'https://app.winappio.com';

export const validatePostbackPassword = (password: string): boolean => {
  return password === POSTBACK_PASSWORD;
};

export const processPostback = async (data: PostbackData) => {
  try {
    // Validate password if provided
    if (data.password && !validatePostbackPassword(data.password)) {
      throw new Error('Invalid postback password');
    }

    // Find the offer click
    const { data: offerClick, error: findError } = await supabase
      .from('offer_clicks')
      .select('*')
      .eq('id', data.click_id)
      .single();

    if (findError || !offerClick) {
      throw new Error('Offer click not found');
    }

    // Get user metadata
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not found');
    }

    // Update user metadata with completed offers count
    const currentOffers = user.user_metadata.offers_completed || 0;
    const newOffersCount = currentOffers + 1;

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        offers_completed: newOffersCount,
        requires_offers: newOffersCount < 3
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
    }

    // Process the completed offer
    const { data: completedOffer, error: processError } = await supabase
      .rpc('process_completed_offer', {
        p_user_id: offerClick.user_id,
        p_offer_click_id: data.click_id,
        p_reward_amount: data.payout || offerClick.reward,
        p_postback_data: {
          offer_id: data.offer_id,
          tracking_id: data.tracking_id,
          ip_address: data.ip_address,
          user_agent: data.user_agent,
          ...data.raw_data
        }
      });

    if (processError) {
      throw processError;
    }

    // Broadcast completion event
    window.postMessage({
      type: 'offerCompleted',
      offerId: data.click_id,
      reward: data.payout || offerClick.reward,
      totalCompleted: newOffersCount
    }, '*');

    return completedOffer;
  } catch (error) {
    console.error('Error processing postback:', error);
    throw error;
  }
};

export const getPostbackUrl = (clickId: string) => {
  return `${POSTBACK_DOMAIN}/api/postback?click_id=${clickId}&payout={payout}&offer_id={offer_id}&tracking_id={tracking_id}&password=${POSTBACK_PASSWORD}`;
};