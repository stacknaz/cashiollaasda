import { supabase } from './supabase';

// Event types for tracking
export enum TrackingEventType {
  IMPRESSION = 'impression',
  CLICK = 'click',
  REGISTRATION = 'registration',
  CONVERSION = 'conversion'
}

// Interface for tracking parameters
export interface TrackingParams {
  offer_id?: string;
  aff_id?: string;
  aff_sub?: string;
  aff_sub2?: string;
  aff_sub3?: string;
  aff_sub4?: string;
  aff_sub5?: string;
  click_id?: string;
  user_id?: string;
  custom_data?: Record<string, any>;
}

/**
 * Initialize the Offer18 tracking SDK
 */
export const initOffer18Tracking = () => {
  // Track page view on initialization
  try {
    trackEvent(TrackingEventType.IMPRESSION).catch(() => {
      // Silent error handling
    });
  } catch (error) {
    // Silent error handling
  }
};

/**
 * Track an event
 * @param eventType The type of event to track
 * @param params Additional tracking parameters
 */
export const trackEvent = async (eventType: TrackingEventType, params: TrackingParams = {}) => {
  try {
    // Get current user if available
    const { data: { user } } = await supabase.auth.getUser();
    
    // Store event in local database if needed
    if (user) {
      await storeTrackingEvent(user.id, eventType, params).catch(() => {
        // Silent error handling
      });
    }
    
    return true;
  } catch (error) {
    // Silent error handling
    return false;
  }
};

/**
 * Store tracking event in local database for analytics
 * @param userId The user ID
 * @param eventType The type of event
 * @param params Additional tracking parameters
 */
const storeTrackingEvent = async (
  userId: string, 
  eventType: TrackingEventType, 
  params: TrackingParams
) => {
  try {
    const { error } = await supabase
      .from('tracking_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        offer_id: params.offer_id || null,
        click_id: params.click_id || null,
        aff_id: params.aff_id || null,
        custom_data: params.custom_data || {},
        created_at: new Date().toISOString()
      });
      
    if (error) {
      // Silent error handling
    }
  } catch (error) {
    // Silent error handling
  }
};

/**
 * Track an offer impression
 * @param offerId The offer ID
 * @param params Additional tracking parameters
 */
export const trackOfferImpression = (offerId: string, params: Omit<TrackingParams, 'offer_id'> = {}) => {
  try {
    return trackEvent(TrackingEventType.IMPRESSION, {
      ...params,
      offer_id: offerId
    }).catch(() => {
      // Silent error handling
      return false;
    });
  } catch (error) {
    // Silent error handling
    return false;
  }
};

/**
 * Track an offer click
 * @param offerId The offer ID
 * @param clickId The click ID
 * @param params Additional tracking parameters
 */
export const trackOfferClick = (offerId: string, clickId: string, params: Omit<TrackingParams, 'offer_id' | 'click_id'> = {}) => {
  try {
    return trackEvent(TrackingEventType.CLICK, {
      ...params,
      offer_id: offerId,
      click_id: clickId
    }).catch(() => {
      // Silent error handling
      return false;
    });
  } catch (error) {
    // Silent error handling
    return false;
  }
};

/**
 * Track a user registration
 * @param userId The user ID
 * @param params Additional tracking parameters
 */
export const trackRegistration = (userId: string, params: Omit<TrackingParams, 'user_id'> = {}) => {
  try {
    return trackEvent(TrackingEventType.REGISTRATION, {
      ...params,
      user_id: userId
    }).catch(() => {
      // Silent error handling
      return false;
    });
  } catch (error) {
    // Silent error handling
    return false;
  }
};

/**
 * Track a conversion
 * @param offerId The offer ID
 * @param clickId The click ID
 * @param userId The user ID
 * @param params Additional tracking parameters
 */
export const trackConversion = (
  offerId: string, 
  clickId: string, 
  userId: string,
  params: Omit<TrackingParams, 'offer_id' | 'click_id' | 'user_id'> = {}
) => {
  try {
    return trackEvent(TrackingEventType.CONVERSION, {
      ...params,
      offer_id: offerId,
      click_id: clickId,
      user_id: userId
    }).catch(() => {
      // Silent error handling
      return false;
    });
  } catch (error) {
    // Silent error handling
    return false;
  }
};