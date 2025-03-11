import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Postback received:', req.query);
  
  try {
    // Extract parameters from the request
    const { click_id, payout, offer_id, tracking_id } = req.query;
    
    if (!click_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameter: click_id' 
      });
    }
    
    // Update the offer click in the database
    const { data, error } = await supabase
      .from('offer_clicks')
      .update({
        status: 'completed',
        payout_amount: typeof payout === 'string' ? parseFloat(payout) : null,
        completed_at: new Date().toISOString()
      })
      .eq('id', click_id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating offer click:', error);
      return res.status(500).json({ 
        success: false, 
        message: `Database error: ${error.message}` 
      });
    }
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        message: `Offer click with ID ${click_id} not found` 
      });
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Postback processed successfully',
      data: {
        id: data.id,
        status: data.status,
        payout: data.payout_amount
      }
    });
  } catch (err: any) {
    console.error('Postback processing error:', err);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${err.message}` 
    });
  }
} 