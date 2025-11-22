# Gremlin Flights ✈️

A Next.js web application that helps users find the **cheapest possible airline fares** by searching flight APIs and discovering creative routing options. Book flights for 30-50% less by leveraging strategic hub cities and direct airline booking.

## 🌟 Key Features

### Price Optimization
- **Price-First Sorting**: All results sorted by price from lowest to highest
- **Creative Routing**: Automatically finds cheaper alternatives through hub cities
- **Direct Airline Booking**: Links directly to airline websites (no OTA markup)
- **USD Pricing**: All prices displayed in USD for easy comparison
- **Smart Filtering**: Only shows airline-direct prices (no third-party operators)

### User Experience
- **45+ Airlines Supported**: Full airline names and verified booking URLs
- **Real-time Search**: Amadeus API integration for accurate, live pricing
- **Search Caching**: 30-minute cache for instant repeat searches
- **Search History**: Track and revisit past searches
- **User Authentication**: Secure login via Supabase

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- [Supabase account](https://supabase.com) (free)
- [Amadeus API key](https://developers.amadeus.com) (free test tier)

### 1. Install
```bash
git clone <your-repo-url>
cd gremlin-flights
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase (get from supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Amadeus API (get from developers.amadeus.com)
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database
1. Go to your Supabase project → SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Run the SQL to create tables

### 4. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test
- Sign up for an account
- Search: **JFK → LAX** (tomorrow)
- Enable "Include creative routing"
- See cheapest options first!

## 💡 How It Works

### Price-First Results

**All flights are merged and sorted by price:**

```
Best Available Flights (Sorted by Price)

1. $299.00 USD [BEST PRICE]
   American Airlines • Direct • 5h 30m
   JFK → LAX

2. $325.00 USD [CREATIVE ROUTING]
   United Airlines • Book separate via ICN
   JFK → ICN → LAX • 12h 45m

3. $349.00 USD
   Delta Air Lines • Direct • 6h 15m
   JFK → LAX
```

The **cheapest option always appears first**, whether it's a direct flight or creative routing.

### Creative Routing Example

Instead of booking **PVG → HND** directly for $500, the engine might find:
- **PVG → ICN** (Seoul) for $200
- **ICN → HND** (Tokyo) for $150
- **Total: $350** (save $150 / 30%)

### Search Flow

1. User enters search criteria (origin, destination, dates)
2. Backend searches Amadeus API for:
   - Direct flights
   - Creative routing via hub cities (if enabled)
3. Results are:
   - Filtered (airline-direct only, no OTAs)
   - Merged (direct + creative)
   - Sorted by price (lowest first)
   - Cached for 30 minutes
4. User clicks "Book Direct on Airline" → Opens airline website

### Direct Airline Booking

All booking links go directly to airlines, not third-party sites:

```typescript
// Example for American Airlines
https://www.aa.com/booking/find-flights?
  locale=en_US&
  from=JFK&
  to=LAX&
  departDate=2025-01-15
```

**Benefits:**
- ✅ No OTA markup or hidden fees
- ✅ Airline customer service and support
- ✅ Earn airline miles and points
- ✅ Direct refunds and changes

## 🗂️ Project Structure

```
gremlin-flights/
├── app/                          # Next.js App Router
│   ├── api/flights/search/       # Flight search API
│   ├── auth/                     # Login/signup pages
│   ├── search/                   # Main search interface
│   └── page.tsx                  # Landing page
│
├── components/
│   └── search/
│       ├── SearchForm.tsx        # Search form
│       └── FlightResults.tsx     # Results (price-sorted)
│
├── lib/
│   ├── api/
│   │   ├── amadeus.ts            # Amadeus API client
│   │   └── flightEngine.ts       # Search orchestration
│   ├── data/
│   │   └── airlines.ts           # Airline database (45+ airlines)
│   └── supabase/                 # Database clients
│
├── types/index.ts                # TypeScript types
├── supabase-schema.sql           # Database schema
├── .env.example                  # Environment template
└── README.md                     # This file
```

## 🗄️ Database Schema

Created by `supabase-schema.sql`:

| Table | Purpose |
|-------|---------|
| `saved_searches` | User's saved searches |
| `flight_results_cache` | API results (30-min cache) |
| `user_preferences` | User settings |
| `price_alerts` | Price monitoring |
| `search_history` | Analytics |

All tables have Row Level Security (RLS) policies.

## ✈️ Supported Airlines (45+)

### US Airlines
American, United, Delta, Southwest, Alaska, JetBlue, Spirit, Frontier

### European Airlines
British Airways, Lufthansa, Air France, KLM, Iberia, Finnair, SAS, TAP Portugal, Swiss, Austrian, Ryanair, easyJet

### Asian Airlines
ANA, JAL, Singapore Airlines, Cathay Pacific, Thai Airways, Korean Air, Asiana, Air China, China Eastern, China Southern

### Middle Eastern
Emirates, Qatar Airways, Etihad

### Latin American
LATAM, Copa, Aeroméxico, Avianca

### Other
Air Canada, Air New Zealand, Qantas, Virgin Australia, Virgin Atlantic, Turkish Airlines, Air India, SAA, Ethiopian

**Unknown airlines** fall back to Google Flights.

## 🎯 Technical Highlights

### 1. Centralized Airline Database
**File:** [lib/data/airlines.ts](lib/data/airlines.ts)

```typescript
export const AIRLINES = {
  'AA': {
    code: 'AA',
    name: 'American Airlines',
    website: 'https://www.aa.com',
    bookingUrlTemplate: 'https://www.aa.com/booking/...'
  },
  // ... 45+ airlines
};
```

**Benefits:**
- Single source of truth
- Easy to maintain
- Verified booking URLs
- Full airline names displayed

### 2. Price-Priority Sorting
**File:** [components/search/FlightResults.tsx](components/search/FlightResults.tsx)

```typescript
// Merge all flights (direct + creative) and sort by price
const allFlights = [
  ...directFlights,
  ...creativeRoutes.flatMap(cr => cr.routes)
].sort((a, b) => a.price - b.price);
```

### 3. Third-Party Filtering
**File:** [lib/api/amadeus.ts](lib/api/amadeus.ts)

```typescript
.filter((offer) => {
  // Only include airline-direct bookings
  const validatingAirlines = offer.validatingAirlineCodes || [];
  const operatingAirline = offer.itineraries[0]?.segments[0]?.carrierCode;
  return validatingAirlines.includes(operatingAirline);
})
```

### 4. USD Currency Enforcement
```typescript
const searchParams = {
  // ... other params
  currencyCode: 'USD', // Force USD pricing
};
```

## 📊 API Usage

### Amadeus API Limits
- **Test Environment**: 10 TPS (free)
- **Production**: Higher limits with approval

### API Calls Per Search
- **Direct flights only**: 1 call
- **With creative routing**: ~11 calls
  - 1 for direct flights
  - 2 per hub checked (5 hubs = 10 calls)

### Caching Strategy
- Results cached for 30 minutes
- Significantly reduces API usage
- Essential for creative routing performance

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AMADEUS_API_KEY`
   - `AMADEUS_API_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
4. Deploy!

### 3. Configure Supabase
1. Go to Supabase → Authentication → URL Configuration
2. Add your Vercel URL to allowed redirect URLs

## 🔧 Troubleshooting

### No Results Found
- ✅ Verify airport codes (3-letter IATA: JFK, LAX, etc.)
- ✅ Check API credentials in `.env.local`
- ✅ Try different dates or routes
- ✅ Check Amadeus API rate limits

### Authentication Issues
- ✅ Verify Supabase credentials
- ✅ Ensure database schema is created
- ✅ Check redirect URLs in Supabase settings
- ✅ Clear browser cookies

### Build Errors
- ✅ Ensure all env variables are set
- ✅ Restart dev server after env changes
- ✅ Run `npm install` to ensure dependencies
- ✅ Check Node.js version (18+ required)

### API Errors
- ✅ Amadeus test keys must be from test.api.amadeus.com
- ✅ Check API key quotas haven't been exceeded
- ✅ Verify API credentials are active

## 📝 Airport Codes

Use IATA 3-letter codes:

| Code | Airport |
|------|---------|
| JFK | New York JFK |
| LAX | Los Angeles |
| LHR | London Heathrow |
| PVG | Shanghai Pudong |
| HND | Tokyo Haneda |
| ICN | Seoul Incheon |
| DXB | Dubai |
| SIN | Singapore Changi |

Find codes at [IATA Airport Codes](https://www.iata.org/en/publications/directories/code-search/)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Flight API**: Amadeus API
- **Deployment**: Vercel
- **Styling**: Tailwind CSS + shadcn/ui

## 📚 Documentation Files

- [PRICING_PRIORITY_UPDATE.md](PRICING_PRIORITY_UPDATE.md) - Price-first sorting implementation
- [DIRECT_BOOKING_IMPLEMENTATION.md](DIRECT_BOOKING_IMPLEMENTATION.md) - Direct airline booking details
- [REFACTOR_NOTES.md](REFACTOR_NOTES.md) - Amadeus-only refactoring notes
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed file structure
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [QUICK_START.md](QUICK_START.md) - Quick start guide

## 🗺️ Roadmap

- [ ] Price alerts via email
- [ ] Multi-currency display (with USD default)
- [ ] Calendar view for flexible dates
- [ ] Saved searches and favorites
- [ ] Mobile app (React Native)
- [ ] More airlines in database
- [ ] Filtering options (direct only, max price, airlines)
- [ ] Hotel and car rental combinations
- [ ] Price history charts
- [ ] Alliance filtering

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Adding New Airlines

To add an airline to the database:

1. Edit [lib/data/airlines.ts](lib/data/airlines.ts)
2. Add entry to `AIRLINES` object:
```typescript
'XX': {
  code: 'XX',
  name: 'Example Airlines',
  website: 'https://www.example.com',
  bookingUrlTemplate: 'https://www.example.com/book?from={origin}&to={destination}&date={date}'
}
```
3. Test the booking URL manually
4. Submit PR

## 📄 License

MIT License - Free to use for personal or commercial purposes.

## ⚠️ Disclaimer

This application is for **educational and research purposes**. Always verify flight details and prices directly with airlines before booking. Flight prices are subject to change and availability.

**Not affiliated with:**
- Any airline or travel agency
- Amadeus (we use their public API)
- Supabase (we use their service)

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/flight-arbitrage/issues)
- **Questions**: Check documentation files above
- **Contributing**: See Contributing section

## 🎉 Recent Updates

### Latest: Price-Priority & Airline Database (2025-11-22)

**New Features:**
- ✅ Price-first sorting (cheapest always first)
- ✅ Centralized airline database (45+ airlines)
- ✅ Full airline names instead of codes
- ✅ Verified booking URLs
- ✅ Shows 15 results (up from 10)

**Previous Updates:**
- Direct airline booking implementation
- USD-only pricing
- Third-party price filtering
- Creative routing algorithm
- Amadeus-only refactoring

---

**Built with ❤️ for travelers who love finding deals**

*Happy flight hunting!* ✈️💰
