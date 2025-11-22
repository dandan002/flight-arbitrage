# Gremlin Flights - Complete Setup Guide

This guide will walk you through setting up Gremlin Flights from scratch.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier available)
- API keys for flight search (Amadeus and/or Kiwi)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React & TypeScript
- Supabase client libraries
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons
- date-fns for date handling

### Step 2: Set Up Supabase Database

#### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign in
3. Click "New Project"
4. Fill in:
   - Project name: `gremlin-flights` (or your preferred name)
   - Database password: Choose a strong password and save it
   - Region: Choose closest to your users
   - Pricing plan: Free (sufficient for development)
5. Wait for the project to be provisioned (2-3 minutes)

#### 2.2 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Project Settings** (gear icon)
2. Click on **API** in the sidebar
3. You'll need these values:
   - **Project URL**: Copy the URL under "Project URL"
   - **anon/public key**: Copy the key under "Project API keys" → "anon public"
   - **service_role key**: Copy the key under "Project API keys" → "service_role" (keep this secret!)

#### 2.3 Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL

This will create:
- Tables: `saved_searches`, `flight_results_cache`, `user_preferences`, `price_alerts`, `search_history`
- Row Level Security (RLS) policies for data protection
- Indexes for performance
- Triggers for automatic timestamp updates

#### 2.4 Enable Email Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Ensure "Email" is enabled
3. Configure email templates if desired (optional)

### Step 3: Get Flight API Keys

#### 3.1 Amadeus API (Recommended)

Amadeus offers a free test environment with comprehensive flight data.

1. Go to [https://developers.amadeus.com/register](https://developers.amadeus.com/register)
2. Sign up for a free account
3. Verify your email
4. Go to "My Self-Service Workspace"
5. Click "Create new app"
6. Fill in:
   - Application name: `Gremlin Flights`
   - Application type: Choose your use case
7. Click "Create"
8. You'll receive:
   - **API Key**
   - **API Secret**
9. Save both credentials

**Rate Limits (Test Environment):**
- 10 transactions per second
- Sufficient for development and testing

#### 3.2 Kiwi (Tequila) API (Recommended for Creative Routing)

Kiwi's API is excellent for finding multi-city routes and creative combinations.

1. Go to [https://tequila.kiwi.com/portal/login](https://tequila.kiwi.com/portal/login)
2. Create an account
3. After login, go to your dashboard
4. Find your API key in the "API Key" section
5. Save the API key

**Note:** Kiwi API pricing varies. Check their current plans for rate limits.

**Alternative APIs (Optional):**
- Skyscanner API
- AviationStack
- RapidAPI Flight Search endpoints

### Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Amadeus API
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret

# Kiwi (Tequila) API
KIWI_API_KEY=your_kiwi_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:**
- Never commit `.env.local` to version control
- The `.env.local` file is already in `.gitignore`
- Use `.env.local.example` as a template for team members

### Step 5: Run the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Step 6: Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up" to create an account
3. Verify you can log in
4. Try a test search:
   - From: `JFK` (New York)
   - To: `LAX` (Los Angeles)
   - Date: Tomorrow's date
   - Enable "Include creative routing"
5. Verify results appear

## Deployment to Vercel

### Step 1: Prepare for Deployment

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a GitHub repository and push:
   ```bash
   git remote add origin https://github.com/yourusername/gremlin-flights.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Add Environment Variables in Vercel

1. In the deployment configuration, expand "Environment Variables"
2. Add each variable from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AMADEUS_API_KEY`
   - `AMADEUS_API_SECRET`
   - `KIWI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL after deployment)

3. Click "Deploy"

### Step 4: Update Supabase Settings

After deployment, update your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

### Step 5: Update Environment Variables

1. Go to your Vercel project settings
2. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
3. Redeploy the application

## Testing Creative Routing

Try these example routes that often have creative routing opportunities:

1. **Asia Routes:**
   - PVG (Shanghai) → HND (Tokyo) via ICN (Seoul)
   - HKG (Hong Kong) → BKK (Bangkok) via SIN (Singapore)

2. **Trans-Atlantic:**
   - JFK (New York) → LHR (London) via IST (Istanbul)
   - LAX (Los Angeles) → CDG (Paris) via DXB (Dubai)

3. **Pacific Routes:**
   - SYD (Sydney) → SFO (San Francisco) via HNL (Honolulu)

## Troubleshooting

### Issue: "Failed to authenticate with Amadeus API"

**Solution:**
- Verify your API Key and Secret are correct
- Check that you're using the test environment credentials
- Ensure there are no extra spaces in your `.env.local` file
- Restart the development server after updating environment variables

### Issue: No results found

**Possible causes:**
1. Invalid airport codes (must be IATA 3-letter codes)
2. No available flights for the selected route/date
3. API rate limits exceeded
4. Invalid API credentials

**Solutions:**
- Verify airport codes at [https://www.iata.org/en/publications/directories/code-search/](https://www.iata.org/en/publications/directories/code-search/)
- Try a different route or date
- Wait a few minutes if rate limited
- Check API credentials in `.env.local`

### Issue: Authentication not working

**Solution:**
- Verify Supabase credentials are correct
- Check that you ran the `supabase-schema.sql` script
- Clear browser cookies and try again
- Check browser console for specific error messages

### Issue: Build fails on Vercel

**Solution:**
- Check that all environment variables are set in Vercel
- Ensure there are no TypeScript errors locally
- Check the build logs in Vercel for specific errors
- Try deploying from a clean git commit

## API Rate Limits & Costs

### Amadeus (Test Environment)
- **Free tier:** Yes
- **Rate limit:** 10 TPS (transactions per second)
- **Monthly calls:** Varies
- **Production:** Requires approval and may have costs

### Kiwi (Tequila)
- **Free tier:** Limited
- **Rate limits:** Varies by plan
- **Check:** [https://tequila.kiwi.com/portal/pricing](https://tequila.kiwi.com/portal/pricing)

### Supabase
- **Free tier:** 500MB database, 50MB file storage, 2GB bandwidth
- **Sufficient for:** Development and small production apps
- **Upgrade:** Available if needed

### Vercel
- **Free tier:** Hobby plan
- **Limits:** 100GB bandwidth, unlimited websites
- **Sufficient for:** Development and personal projects

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use environment variables** for all secrets
3. **Enable RLS** in Supabase (already done in schema)
4. **Keep dependencies updated:** Run `npm audit` regularly
5. **Use HTTPS** in production (automatic with Vercel)
6. **Validate user input** on both client and server

## Support & Resources

- **Amadeus Docs:** [https://developers.amadeus.com/self-service](https://developers.amadeus.com/self-service)
- **Kiwi API Docs:** [https://tequila.kiwi.com/portal/docs](https://tequila.kiwi.com/portal/docs)
- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)

## Next Steps

Once your app is running:

1. Test the search functionality thoroughly
2. Experiment with different routes
3. Monitor API usage to stay within rate limits
4. Consider implementing additional features:
   - Price alerts
   - Saved searches
   - Email notifications
   - Calendar view for flexible dates

Happy flight hunting!
