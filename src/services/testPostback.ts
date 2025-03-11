import { supabase } from '../lib/supabase';
import axios from 'axios';
import type { PostbackResponse } from '../types/postback';

const POSTBACK_BASE_URL = process.env.NEXT_PUBLIC_POSTBACK_URL || 'https://cashiollav1.netlify.app';

export const simulatePostback = async () => {   
  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    if (!user) {
      throw new Error('No authenticated user found. Please log in first.');
    }

    // Create a test offer click with minimal required data
    const { data: offerClick, error: insertError } = await supabase
      .from('offer_clicks')
      .insert({
        user_id: user.id,
        offer_title: 'Test Offer',
        offer_type: 'test',
        reward: 1.50,
        original_link: 'https://example.com/test-offer',
        status: 'clicked'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to create test offer click: ${insertError.message}`);
    }

    if (!offerClick) {
      throw new Error('Failed to create test offer click: No data returned');
    }

    // Generate postback URL with only required parameters
    const postbackParams = new URLSearchParams({
      click_id: offerClick.id,
      payout: '1.50',
      offer_id: '195',
      tracking_id: user.id
    });

    const postbackUrl = `${POSTBACK_BASE_URL}/api/postback?${postbackParams.toString()}`;
    
    console.log('Testing postback URL:', postbackUrl);

    // Make the postback request with timeout and error handling
    try {
      const response = await axios.get<PostbackResponse>(postbackUrl, {
        timeout: 10000 // 10 second timeout
      });
      
      // Log the response for debugging
      console.log('Postback Response:', JSON.stringify(response.data, null, 2));

      return {
        offerClick: {
          id: offerClick.id,
          status: offerClick.status,
          reward: offerClick.reward,
          created_at: offerClick.created_at
        },
        postbackResponse: {
          success: response.data.success,
          message: response.data.message,
          data: response.data.data ? {
            id: response.data.data.id,
            status: response.data.data.status,
            payout: response.data.data.payout
          } : null
        },
        postbackUrl // Return the URL for reference
      };
    } catch (axiosError: any) {
      console.error('Axios request error:', axiosError);
      
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      } else if (axiosError.request) {
        // The request was made but no response was received
        throw new Error('No response received from the postback API. Please check if the API server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error making request: ${axiosError.message}`);
      }
    }
  } catch (error: any) {
    console.error('Test postback error:', error);
    // Make sure we're always returning a string message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error));
    }
  }
};