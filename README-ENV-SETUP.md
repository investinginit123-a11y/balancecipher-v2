# Environment Variables Setup Guide

## The Error You're Seeing

If you see this error:
```
CRM POST failed: 500 — {"ok":false,"error":"Missing NP_CRM_INGEST_URL"}
```

This means:
✅ **Good news!** The application code is working correctly
❌ **Setup needed:** Server-side environment variables are not configured

## Understanding the Architecture

The application uses a **serverless API proxy** for security:

```
Frontend (Browser)
    ↓ POST /api/applications
Serverless Function (api/applications.js)
    ↓ Uses server-side env vars
    ↓ POST to CRM
Your CRM System
```

This prevents API keys from being exposed in the browser.

## Local Development

### Option 1: Test Without Real CRM (Recommended for Development)

The app will show the configuration error, which is expected. You can:
1. Test the UI flow (pages 1-4 work perfectly)
2. On page 5, you'll see the env var error (this is normal)
3. Deploy to Vercel to test with real CRM integration

### Option 2: Test With Mock CRM Locally

You can temporarily modify `api/applications.js` to add mock responses:

```javascript
// At the top of api/applications.js, add:
const isDevelopment = !process.env.NP_CRM_INGEST_URL;

if (isDevelopment) {
  console.log('[DEV] Mock CRM response - would send:', req.body);
  res.status(200).json({ ok: true, mockMode: true });
  return;
}
```

## Production Deployment (Vercel)

### Required Environment Variables

In your Vercel Dashboard, configure these **server-side** environment variables:

1. **NP_CRM_INGEST_URL**
   - Description: Your CRM webhook/API endpoint URL
   - Example: `https://your-crm.com/api/webhooks/applications`
   - Scope: Production, Preview, Development (as needed)

2. **NP_API_KEY**
   - Description: Your CRM API authentication key
   - Example: `sk_live_abc123def456...`
   - Scope: Production, Preview, Development (as needed)

### How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** `NP_CRM_INGEST_URL`
   - **Value:** Your CRM endpoint URL
   - **Environments:** Select which environments need it
4. Click **Save**
5. Redeploy your application

After adding the variables and redeploying, the email submission on Page 5 will work correctly.

## Troubleshooting

### "Missing NP_CRM_INGEST_URL"
- Environment variable not set in Vercel
- Solution: Add the variable in Vercel Dashboard → Settings → Environment Variables

### "Missing NP_API_KEY"  
- API key not set in Vercel
- Solution: Add the variable in Vercel Dashboard → Settings → Environment Variables

### "CRM POST failed: 404"
- In local dev: Expected (Vite doesn't serve /api/* routes)
- In production: Serverless function not deployed correctly
- Solution: Ensure `api/applications.js` is committed and deployed

### "CRM POST failed: [other status]"
- The serverless function is working, but the CRM returned an error
- Check your CRM endpoint configuration
- Verify API key is correct
- Check CRM logs for specific error details

## Security Notes

- ✅ API keys are never exposed to the browser
- ✅ All CRM communication happens server-side
- ✅ CORS issues are avoided
- ✅ Environment variables are properly scoped
- ❌ Do NOT use `VITE_*` prefix for these variables (those are exposed to the browser)

## Testing Checklist

**Before deploying to production:**
- [ ] Environment variables configured in Vercel Dashboard
- [ ] Application builds successfully (`npm run build`)
- [ ] Test deployment in Vercel Preview environment
- [ ] Submit test email on Page 5
- [ ] Verify email received in your CRM
- [ ] Check Vercel logs for any errors

**Local development:**
- [ ] Application runs (`npm run dev`)
- [ ] Can navigate pages 1-4
- [ ] Page 5 shows configuration error (expected without env vars)
- [ ] Build succeeds

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/projects/environment-variables)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
