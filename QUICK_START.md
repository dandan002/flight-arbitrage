# Quick Start Guide

Get your Gremlin Flights running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free)
- At least one flight API key (Amadeus or Kiwi)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials (get these from the services):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret

KIWI_API_KEY=your_kiwi_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Set Up Supabase Database

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute

## 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Test It Out

1. Sign up for an account
2. Try a search:
   - From: JFK
   - To: LAX
   - Date: Tomorrow
   - Enable "Include creative routing"

## Where to Get API Keys

### Supabase (Required)
- [https://supabase.com](https://supabase.com)
- Free tier available
- Get: URL, anon key, service role key

### Amadeus API (Recommended)
- [https://developers.amadeus.com](https://developers.amadeus.com)
- Free test environment
- Get: API Key and API Secret

### Kiwi API (Recommended for Creative Routing)
- [https://tequila.kiwi.com](https://tequila.kiwi.com)
- Limited free tier
- Get: API Key

## Troubleshooting

**Build errors?**
- Make sure all environment variables are set
- Restart dev server after changing `.env.local`

**No results?**
- Verify airport codes (use 3-letter IATA codes)
- Check API credentials are correct
- Try different routes/dates

**Auth not working?**
- Verify Supabase credentials
- Check database schema was created
- Clear browser cookies

## Next Steps

- See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- See [README.md](README.md) for full documentation
- Deploy to Vercel when ready!

Happy flight hunting! ✈️
