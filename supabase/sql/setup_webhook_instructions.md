# Supabase Database Webhook Setup Instructions

## Alternative to Database Trigger: Using Database Webhooks

If you prefer to use Supabase Database Webhooks instead of database triggers, follow these steps:

### Step 1: Navigate to Webhooks

1. Go to your Supabase Dashboard
2. Navigate to **Database** > **Webhooks**
3. Click **"Create a new webhook"**

### Step 2: Configure the Webhook

**Basic Configuration:**
- **Name:** `Auto Score Lead`
- **Table:** `leads`
- **Events:** Select `INSERT` only
- **Enabled:** ✅ (checked)

**HTTP Request Configuration:**

**URL:**
```
https://vwryhloimldyajtobnol.supabase.co/functions/v1/autoScoreLead
```
*(Replace `vwryhloimldyajtobnol` with your actual Supabase project reference)*

**Method:** `POST`

**HTTP Headers:**
Add the following headers:
```
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
Content-Type: application/json
```

To get your Service Role Key:
- Go to Supabase Dashboard > Settings > API
- Copy the `service_role` key (it's secret, keep it safe!)

**Payload:**

```json
{
  "type": "INSERT",
  "table": "leads",
  "record": {{ $json }}
}
```

The `{{ $json }}` syntax automatically includes the full lead record as JSON.

### Step 3: Test the Webhook

1. Insert a test lead into the `leads` table
2. Check the webhook logs in the Dashboard
3. Verify that the `autoScoreLead` function was called
4. Check that the lead has an `ai_score` and `ai_reason`

### Step 4: Monitor and Debug

- View webhook execution logs in the Dashboard
- Check Edge Function logs in **Functions** > **autoScoreLead** > **Logs**
- Verify lead scores in the `leads` table

## Benefits of Database Webhooks vs Triggers

✅ **More Reliable:**
- Better error handling
- Automatic retries
- Easier to debug

✅ **Better Performance:**
- No database extension required
- Asynchronous processing
- Non-blocking

✅ **Easier Management:**
- Visual interface in Dashboard
- Easy to enable/disable
- Better monitoring

## Troubleshooting

**Webhook not firing:**
- Check that the webhook is enabled
- Verify the URL is correct
- Check HTTP headers (especially Authorization)
- Review webhook logs in Dashboard

**Edge Function not receiving data:**
- Verify payload format matches expected structure
- Check Edge Function logs
- Ensure service role key is correct

**Scores not appearing:**
- Check Edge Function execution logs
- Verify OpenAI API key is set in Edge Function secrets
- Check database permissions for UPDATE on leads table

