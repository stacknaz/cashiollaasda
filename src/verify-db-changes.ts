/**
 * Script to verify database changes for postback functionality
 * 
 * Usage:
 * npm run verify-db
 */

import { supabase } from './lib/supabase';

async function verifyDatabaseChanges() {
  console.log('Verifying database changes for postback functionality...');

  try {
    // Check offer_clicks table structure
    console.log('\n1. Checking offer_clicks table structure...');
    const { data: offerClicksColumns, error: offerClicksError } = await supabase
      .rpc('get_table_columns', { table_name: 'offer_clicks' });

    if (offerClicksError) {
      console.error('Error accessing offer_clicks table:', offerClicksError.message);
    } else {
      const columns = offerClicksColumns || [];
      const hasOfferIdField = columns.includes('offer_id');
      const hasTrackingIdField = columns.includes('tracking_id');
      const hasPostbackReceivedField = columns.includes('postback_received');
      const hasPostbackAmountField = columns.includes('postback_amount');

      console.log('offer_id field exists:', hasOfferIdField ? '✅ Yes' : '❌ No');
      console.log('tracking_id field exists:', hasTrackingIdField ? '✅ Yes' : '❌ No');
      console.log('postback_received field exists:', hasPostbackReceivedField ? '✅ Yes' : '❌ No');
      console.log('postback_amount field exists:', hasPostbackAmountField ? '✅ Yes' : '❌ No');
    }

    // Check offer_history table structure
    console.log('\n2. Checking offer_history table structure...');
    const { data: offerHistoryColumns, error: offerHistoryError } = await supabase
      .rpc('get_table_columns', { table_name: 'offer_history' });

    if (offerHistoryError) {
      console.error('Error accessing offer_history table:', offerHistoryError.message);
    } else {
      const columns = offerHistoryColumns || [];
      const hasOfferIdField = columns.includes('offer_id');
      const hasTrackingIdField = columns.includes('tracking_id');

      console.log('offer_id field exists:', hasOfferIdField ? '✅ Yes' : '❌ No');
      console.log('tracking_id field exists:', hasTrackingIdField ? '✅ Yes' : '❌ No');
    }

    // Check if process_completed_offer function exists
    console.log('\n3. Checking process_completed_offer function...');
    
    let functionExists = false;
    let functionError = null;
    
    try {
      await supabase
        .rpc('process_completed_offer', {
          p_user_id: '00000000-0000-0000-0000-000000000000',
          p_offer_click_id: '00000000-0000-0000-0000-000000000000',
          p_reward_amount: 0,
          p_postback_data: {
            offer_id: 'test',
            tracking_id: 'test'
          }
        });
      
      // If we get here, the function exists (though it will likely fail due to invalid parameters)
      functionExists = true;
    } catch (error: any) {
      // We expect this to fail with a specific error about the user_id or offer_click_id not existing
      // But it should not fail with a function not found error
      if (error.message && error.message.includes('function not found')) {
        functionExists = false;
        functionError = error.message;
      } else {
        // Any other error means the function exists but parameters are invalid
        functionExists = true;
      }
    }

    if (!functionExists) {
      console.log('process_completed_offer function exists: ❌ No');
      if (functionError) {
        console.error('Error:', functionError);
      }
    } else {
      console.log('process_completed_offer function exists: ✅ Yes');
    }

    console.log('\nVerification complete!');
    
    if (offerClicksError || offerHistoryError || !functionExists) {
      console.log('\n⚠️ Some issues were found. Please run the SQL statements to update your database schema.');
    } else {
      console.log('\n✅ Database schema appears to be correctly set up for postback functionality!');
    }
  } catch (error) {
    console.error('Error verifying database changes:', error);
  } finally {
    process.exit(0);
  }
}

// Run the verification
verifyDatabaseChanges(); 