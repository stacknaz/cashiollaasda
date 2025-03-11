import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a Supabase client with service role key to bypass RLS
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test the connection
supabase.auth.getSession().then(() => {
  console.log('✅ Supabase connection successful with service role');
}).catch(err => {
  console.error('❌ Supabase connection failed:', err);
});

export const handlePostback = async (req: Request, res: Response) => {
  try {
    // Get parameters from query or body
    const clickId = req.query.click_id?.toString() || req.body.click_id;
    const payout = req.query.payout ? parseFloat(req.query.payout.toString()) : (req.body.payout || 0);
    const offerId = req.query.offer_id?.toString() || req.body.offer_id;
    const trackingId = req.query.tracking_id?.toString() || req.body.tracking_id;

    console.log('Received postback:', { clickId, payout, offerId, trackingId });

    // Validate click_id
    if (!clickId) {
      return res.status(400).json({
        success: false,
        error: 'Missing click_id parameter'
      });
    }

    // Log the query we're about to make
    console.log('Searching for click with ID:', clickId);

    // Check if click exists and get user info
    const { data: click, error: checkError } = await supabase
      .from('offer_clicks')
      .select('*')
      .eq('id', clickId)
      .single();

    if (checkError) {
      console.error('Error checking click:', checkError);
      return res.status(400).json({
        success: false,
        error: `Database error: ${checkError.message}`
      });
    }

    if (!click) {
      console.error('Click not found in database:', clickId);
      return res.status(400).json({
        success: false,
        error: 'Click not found in database'
      });
    }

    console.log('Found click:', click);

    // Check if already completed
    if (click.status === 'completed' && click.postback_received) {
      return res.json({
        success: true,
        message: 'Postback already processed',
        data: {
          click_id: clickId,
          status: 'completed'
        }
      });
    }

    console.log('Updating click status to completed...');

    // Update the click record
    const { error: updateError } = await supabase
      .from('offer_clicks')
      .update({
        status: 'completed',
        postback_received: true,
        postback_amount: payout || click.reward,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', clickId);

    if (updateError) {
      console.error('Failed to update click:', updateError);
      return res.status(500).json({
        success: false,
        error: `Update failed: ${updateError.message}`
      });
    }

    console.log('Click updated successfully');

    // Store in completed_offers table
    const { error: completedOfferError } = await supabase
      .from('completed_offers')
      .insert({
        user_id: click.user_id,
        offer_click_id: clickId,
        reward_amount: click.reward,
        final_reward: payout || click.reward,
        multiplier: (payout || click.reward) / click.reward,
        completed_at: new Date().toISOString(),
        verification_status: 'verified',
        postback_data: {
          offer_id: offerId || click.offer_id,
          tracking_id: trackingId || click.tracking_id,
          payout: payout || click.reward,
          original_data: req.query || req.body
        }
      });

    if (completedOfferError) {
      console.error('Failed to store completed offer:', completedOfferError);
      // Don't return error to client as the main operation succeeded
    } else {
      console.log('Completed offer stored successfully');
    }

    // Return success response
    return res.json({
      success: true,
      message: 'Postback processed successfully',
      data: {
        click_id: clickId,
        offer_id: offerId || click.offer_id,
        tracking_id: trackingId || click.tracking_id,
        payout: payout || click.reward,
        user_id: click.user_id
      }
    });

  } catch (error) {
    console.error('Postback error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};