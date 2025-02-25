import { supabase } from '../lib/supabase';
import axios from 'axios';
import type { PostbackResponse } from '../types/postback';

export const simulatePostback = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    // Create a test offer click
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
      throw insertError;
    }

    // Simulate postback
    const postbackUrl = `http://localhost:3000/api/postback?click_id=${offerClick.id}&payout=1.50&offer_id=195&tracking_id=${user.id}&password=7839877`;
    
    const response = await axios.get<PostbackResponse>(postbackUrl);

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
      }
    };
  } catch (error) {
    console.error('Test postback error:', error);
    throw error;
  }
};