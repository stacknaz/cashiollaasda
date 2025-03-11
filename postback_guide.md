# Complete Guide to Using the Postback System

This guide will walk you through setting up and using the postback system for your offerwall application.

## 1. Update the Database Schema

Before using the postback system, you need to update your Supabase database schema:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Create a new query and paste the SQL from `update_schema.sql`
5. Run the SQL statements

## 2. Verify Database Changes

After updating the database schema, verify that the changes were applied correctly:

```bash
npm run verify-db
```

This will check if the necessary columns and functions exist in your database.

## 3. Understanding the Postback Flow

A postback is a server-to-server callback that happens when a user completes an offer:

1. User clicks on an offer (creates an offer_click record)
2. User completes the offer on the advertiser's site
3. Advertiser sends a postback to your server with the click_id and reward information
4. Your server processes the postback and credits the user

## 4. Postback URL Format

The postback URL that you provide to advertisers should look like this:

```
http://your-domain.com/api/postback?click_id={click_id}&payout={payout}&offer_id={offer_id}&tracking_id={tracking_id}
```

Where:
- `{click_id}` is the unique identifier for the offer click (required)
- `{payout}` is the reward amount (optional)
- `{offer_id}` is the advertiser's offer identifier (optional but recommended)
- `{tracking_id}` is additional tracking information (optional)

## 5. Generating Postback URLs

You can generate postback URLs in your code using the `getPostbackUrl` function:

```typescript
import { getPostbackUrl } from './services/postbackService';

// Generate a basic postback URL
const postbackUrl = getPostbackUrl(clickId);

// Generate a postback URL with default payout and offer_id
const postbackUrl = getPostbackUrl(clickId, 10.5, 'my_offer_123');
```

## 6. Testing the Postback System

### Option 1: Using the test-postback script

```bash
npm run test-postback <click_id> [payout] [offer_id]
```

For example:
```bash
npm run test-postback abc123 10.5 my_test_offer
```

This will send both GET and POST test postbacks to your server.

### Option 2: Using the test endpoint

Visit:
```
http://localhost:3000/api/test-postback?click_id=abc123&payout=10.5&offer_id=my_test_offer
```

This will return a JSON response with a ready-to-use test URL.

### Option 3: Direct postback URL

You can directly call the postback endpoint:

```
http://localhost:3000/api/postback?click_id=abc123&payout=10.5&offer_id=my_test_offer&tracking_id=test_123
```

## 7. Checking Postback Results

After a postback is processed, you can check:

1. The server logs will show details about the processed postback
2. The database will be updated:
   - The `offer_clicks` table will have:
     - `status` updated to "completed"
     - `offer_id` and `tracking_id` stored
     - `postback_received` flag set to true
     - `postback_amount` containing the payout value
   - The `offer_history` table will have a new record with the offer details

## 8. Troubleshooting

If you encounter issues:

1. Check the server logs for error messages
2. Verify that the click_id exists in your database
3. Make sure the postback URL is correctly formatted
4. Ensure all parameters are properly URL-encoded
5. Run `npm run verify-db` to check if your database schema is correct

## 9. Production Deployment

For production, you should:

1. Set the `POSTBACK_DOMAIN` environment variable to your production domain
2. Ensure your server is accessible from the internet
3. Consider adding additional security measures like IP whitelisting or secret keys

## 10. Example Postback Implementation

Here's a complete example of how to implement postbacks in your application:

```typescript
// When a user clicks on an offer
async function handleOfferClick(userId, offerDetails) {
  // Create an offer click record
  const { data: offerClick, error } = await supabase
    .from('offer_clicks')
    .insert({
      user_id: userId,
      offer_title: offerDetails.title,
      offer_type: offerDetails.type,
      reward: offerDetails.reward,
      original_link: offerDetails.link,
      device_info: getDeviceInfo(),
      category: offerDetails.category,
      points: offerDetails.points
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating offer click:', error);
    return null;
  }

  // Generate the postback URL to provide to the advertiser
  const postbackUrl = getPostbackUrl(offerClick.id, offerDetails.reward, offerDetails.id);
  
  // Return the postback URL along with the redirect link
  return {
    redirectLink: offerDetails.link,
    postbackUrl: postbackUrl
  };
}
```

## 11. Monitoring Postbacks

To monitor postbacks in your application:

1. Check the server logs for postback requests
2. Query the database for completed offers:

```sql
SELECT * FROM offer_clicks WHERE postback_received = true ORDER BY completed_at DESC;
```

3. Check user stats to see if rewards are being credited correctly:

```sql
SELECT * FROM user_stats WHERE user_id = 'your-user-id';
```

## 12. Advanced: Custom Postback Formats

If an advertiser requires a custom postback format, you can create a custom endpoint:

1. Create a new route in your server.ts file
2. Parse the custom parameters
3. Map them to your standard postback format
4. Call the processPostback function

Example:
```typescript
// Custom postback for Advertiser X
app.get('/api/postback/advertiser-x', (req, res) => {
  const { uid, amount, campaign } = req.query;
  
  // Map to standard format
  const result = await processPostback({
    click_id: uid as string,
    status: 'completed',
    payout: amount ? parseFloat(amount as string) : undefined,
    offer_id: campaign as string,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    raw_data: req.query
  });
  
  res.status(200).send('OK');
});
``` 