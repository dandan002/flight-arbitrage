# Project Structure

```
flight-arbitrage/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── flights/
│   │   │   └── search/
│   │   │       └── route.ts      # Flight search API endpoint
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts      # Auth callback handler
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── signup/
│   │       └── page.tsx          # Signup page
│   ├── search/
│   │   └── page.tsx              # Main search page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── ui/
│   │   └── button.tsx            # Reusable button component
│   ├── auth/                     # Auth-related components
│   └── search/
│       ├── SearchForm.tsx        # Flight search form
│       └── FlightResults.tsx     # Results display
│
├── lib/                          # Library code
│   ├── api/
│   │   ├── amadeus.ts            # Amadeus API client
│   │   ├── kiwi.ts               # Kiwi API client
│   │   └── flightEngine.ts       # Main search engine
│   └── supabase/
│       ├── client.ts             # Browser client
│       ├── server.ts             # Server client
│       └── middleware.ts         # Auth middleware
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── utils/                        # Utility functions
│
├── .env.local.example            # Environment variables template
├── .env.local                    # Your environment variables (not committed)
├── middleware.ts                 # Next.js middleware for auth
├── supabase-schema.sql           # Database schema
├── vercel.json                   # Vercel configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── next.config.ts                # Next.js config
├── README.md                     # Project documentation
├── SETUP_GUIDE.md                # Detailed setup instructions
└── PROJECT_STRUCTURE.md          # This file
```

## Key Files Explained

### API Layer

- **lib/api/amadeus.ts**: Handles Amadeus API authentication and flight searches
- **lib/api/kiwi.ts**: Handles Kiwi API searches and creative routing
- **lib/api/flightEngine.ts**: Orchestrates multiple APIs, deduplicates results, implements creative routing algorithm

### Database Layer

- **lib/supabase/client.ts**: Browser-side Supabase client
- **lib/supabase/server.ts**: Server-side Supabase client
- **lib/supabase/middleware.ts**: Session management
- **supabase-schema.sql**: Complete database schema with RLS policies

### Frontend

- **app/page.tsx**: Landing page with features and examples
- **app/search/page.tsx**: Main search interface
- **components/search/SearchForm.tsx**: Flight search form with all filters
- **components/search/FlightResults.tsx**: Results display with creative routing options

### Authentication

- **app/auth/login/page.tsx**: Login page
- **app/auth/signup/page.tsx**: Registration page
- **app/api/auth/callback/route.ts**: OAuth callback handler
- **middleware.ts**: Protects routes, refreshes sessions

### Configuration

- **.env.local**: Environment variables (create from .env.local.example)
- **vercel.json**: Vercel deployment configuration
- **tsconfig.json**: TypeScript compiler options
- **tailwind.config.ts**: Tailwind CSS customization

## Data Flow

1. **User submits search** → SearchForm component
2. **POST /api/flights/search** → API route
3. **Check cache** → Supabase flight_results_cache table
4. **If not cached**:
   - FlightSearchEngine queries Amadeus + Kiwi APIs in parallel
   - For creative routing: searches hub city combinations
   - Deduplicates and sorts results
   - Caches results for 30 minutes
5. **Returns results** → FlightResults component
6. **User clicks "Book Now"** → Direct link to airline website

## Database Tables

- **saved_searches**: User's saved search parameters
- **flight_results_cache**: API results cache (30-min expiry)
- **user_preferences**: User settings and preferences
- **price_alerts**: Price monitoring for specific routes
- **search_history**: Analytics and user search history

## Environment Variables

Required in `.env.local`:
- Supabase: URL, anon key, service role key
- Amadeus: API key, API secret
- Kiwi: API key
- App: Base URL

## Creative Routing Algorithm

1. Identifies relevant hub cities based on origin/destination regions
2. Searches for leg 1 (origin → hub) and leg 2 (hub → destination)
3. Combines results and calculates total price
4. Compares with direct flights
5. Displays savings opportunities

Hub cities by region:
- Asia: ICN, HND, NRT, HKG, SIN, BKK, TPE
- Europe: AMS, CDG, FRA, LHR, IST, MAD
- Middle East: DXB, DOH, AUH
- North America: JFK, LAX, ORD, DFW, ATL
- Pacific: SYD, MEL, AKL
