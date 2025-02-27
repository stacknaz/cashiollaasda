import { Request, Response } from 'express';
import { processPostback, validatePostbackPassword } from '../services/postbackService';

export const handlePostback = async (req: Request, res: Response) => {
  try {
    const { click_id, payout, offer_id, tracking_id, password } = req.query;

    // Log incoming request
    console.log('Received postback:', {
      click_id,
      payout,
      offer_id,
      tracking_id,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Validate required parameters
    if (!click_id || !payout || !offer_id || !tracking_id || !password) {
      console.error('Missing required parameters:', { click_id, payout, offer_id, tracking_id });
      return res.status(400).json({
        error: 'Missing required parameters'
      });
    }

    // Validate password
    if (!validatePostbackPassword(password as string)) {
      console.error('Invalid password');
      return res.status(401).json({
        error: 'Invalid password'
      });
    }

    // Process the postback
    const result = await processPostback({
      click_id: click_id as string,
      status: 'completed',
      payout: parseFloat(payout as string),
      offer_id: offer_id as string,
      tracking_id: tracking_id as string,
      password: password as string,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'] as string,
      raw_data: req.query
    });

    console.log('Postback processed successfully:', result);

    return res.json({
      success: true,
      message: 'Postback processed successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Postback error:', error);
    return res.status(500).json({
      error: 'Failed to process postback',
      details: error.message
    });
  }
};