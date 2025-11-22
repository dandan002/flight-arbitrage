# CLAUDE.md - AI Assistant Guide for Flight Arbitrage Engine

**Last Updated:** 2025-11-22
**For:** AI assistants working on this codebase
**Project:** Flight Arbitrage Engine - A Next.js app for finding the cheapest flight routes

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Directory Structure](#directory-structure)
5. [Key Conventions](#key-conventions)
6. [Development Workflows](#development-workflows)
7. [Common Tasks](#common-tasks)
8. [Important Constraints](#important-constraints)
9. [API Integration](#api-integration)
10. [Database Schema](#database-schema)
11. [Testing & Deployment](#testing--deployment)

---

## Project Overview

### Purpose
The Flight Arbitrage Engine helps users find the **cheapest possible airline fares** by:
- Searching multiple routes through the Amadeus API
- Discovering creative routing options via hub cities
- Providing direct airline booking links (no OTA markup)
- Displaying all prices in USD sorted by price (lowest first)

### Core Features
1. **Price-First Sorting** - Cheapest flights always appear first
2. **Creative Routing** - Finds cheaper alternatives through hub cities (e.g., NYC→Seoul→Tokyo instead of NYC→Tokyo)
3. **Direct Booking** - 45+ airlines with verified booking URLs
4. **Search Caching** - 30-minute cache to reduce API calls
5. **City-Wide Codes** - Support for city codes (NYC, TYO, LON) that search all airports in a city
6. **User Authentication** - Supabase auth with search history

### Recent Major Changes
- **2025-11-22**: Added airport autocomplete with city-wide code support
- **2025-11-22**: Implemented price-first sorting and centralized airline database
- **Earlier**: Refactored to use Amadeus-only API (removed Kiwi/Skyscanner)

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Date Handling**: date-fns 4.1.0

### Backend
- **API Routes**: Next.js API Routes (`app/api/**/route.ts`)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Flight API**: Amadeus API (test environment)
- **HTTP Client**: Axios 1.13.2

### Infrastructure
- **Hosting**: Vercel (recommended)
- **Database Hosting**: Supabase
- **Version Control**: Git

### Build Tools
- **Package Manager**: npm
- **Linter**: ESLint 9
- **TypeScript Config**: Strict mode enabled

---

## Architecture

### Application Pattern
- **Next.js App Router** with server and client components
- **Server-side rendering** for initial page loads
- **Client-side state** for interactive search forms
- **API routes** for backend logic

### Data Flow

```
User Input (SearchForm.tsx)
    ↓
POST /api/flights/search (route.ts)
    ↓
FlightSearchEngine (flightEngine.ts)
    ↓
AmadeusAPI (amadeus.ts) + City Code Expansion (airports.ts)
    ↓
Results cached in Supabase (30 min)
    ↓
Displayed in FlightResults.tsx (price-sorted)
```

### Authentication Flow

```
User → Supabase Auth → Middleware (middleware.ts)
    ↓
Protected Routes (search, API)
    ↓
RLS Policies enforce user isolation
```

---

## Directory Structure

```
flight-arbitrage/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── flights/search/       # Flight search endpoint
│   │       └── route.ts          # POST: search, GET: history
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts     # OAuth callback
│   ├── search/
│   │   └── page.tsx              # Main search interface
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── search/
│   │   ├── SearchForm.tsx        # Search form with autocomplete
│   │   └── FlightResults.tsx     # Results display (price-sorted)
│   └── ui/
│       ├── airport-autocomplete.tsx  # Airport search with city codes
│       └── button.tsx            # Reusable button component
│
├── lib/
│   ├── api/
│   │   ├── amadeus.ts            # Amadeus API client
│   │   └── flightEngine.ts       # Search orchestration & creative routing
│   ├── data/
│   │   ├── airlines.ts           # 45+ airline database (CRITICAL)
│   │   └── airports.ts           # 1000+ airports + city code expansion
│   └── supabase/
│       ├── client.ts             # Client-side Supabase
│       ├── server.ts             # Server-side Supabase
│       └── middleware.ts         # Auth middleware
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── public/                       # Static assets (SVGs)
│
├── middleware.ts                 # Next.js middleware (auth)
├── supabase-schema.sql           # Database schema
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── eslint.config.mjs             # ESLint config
├── next.config.ts                # Next.js config
├── postcss.config.mjs            # PostCSS config
└── .gitignore                    # Git ignore rules
```

### Key Files by Purpose

| Purpose | Files |
|---------|-------|
| **Type Definitions** | `types/index.ts` |
| **Search Logic** | `lib/api/flightEngine.ts`, `lib/api/amadeus.ts` |
| **Airline Data** | `lib/data/airlines.ts` (NEVER hardcode airline info elsewhere) |
| **Airport Data** | `lib/data/airports.ts` (includes city code expansion) |
| **API Endpoints** | `app/api/flights/search/route.ts` |
| **UI Components** | `components/search/*`, `components/ui/*` |
| **Auth** | `lib/supabase/*`, `middleware.ts` |

---

## Key Conventions

### TypeScript
- **Strict mode enabled** - all types must be defined
- **No `any` types** - use specific types or `unknown`
- **Interface naming** - PascalCase (e.g., `FlightRoute`, `SearchParams`)
- **Path aliases** - Use `@/` for absolute imports (configured in `tsconfig.json`)

### React Components
- **Client components** - Mark with `'use client'` directive at top
- **Server components** - Default, no directive needed
- **Props interface** - Always define TypeScript interface for props
- **File naming** - PascalCase for components (e.g., `SearchForm.tsx`)

### API Routes
- **Export named functions** - `POST`, `GET`, `PUT`, `DELETE`
- **Return NextResponse** - Always use `NextResponse.json()`
- **Error handling** - Try/catch with proper HTTP status codes
- **Authentication** - Check `supabase.auth.getUser()` first

### Styling
- **Tailwind CSS only** - No custom CSS files
- **Utility classes** - Use Tailwind utilities directly in JSX
- **Responsive design** - Use `md:`, `lg:` prefixes for breakpoints
- **Color palette** - Use Tailwind's default colors

### Data Handling
- **Price sorting** - ALWAYS sort by price (lowest first)
- **USD only** - All prices in USD (enforced in API calls)
- **Airline lookup** - ALWAYS use `lib/data/airlines.ts` for airline info
- **City codes** - Use `expandCityCode()` from `lib/data/airports.ts`

### Code Organization
- **Single responsibility** - Each file/function does one thing
- **DRY principle** - No duplicate code, use shared functions
- **Comment sparingly** - Code should be self-documenting
- **Error messages** - User-friendly messages, log technical details

---

## Development Workflows

### Environment Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_ROLE_KEY=xxx
   AMADEUS_API_KEY=xxx
   AMADEUS_API_SECRET=xxx
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Set up database**:
   - Run `supabase-schema.sql` in Supabase SQL Editor

4. **Start dev server**:
   ```bash
   npm run dev
   # App runs at http://localhost:3000
   ```

### Making Changes

#### When modifying search logic:
1. Update types in `types/index.ts` if needed
2. Modify core logic in `lib/api/flightEngine.ts` or `lib/api/amadeus.ts`
3. Update API route in `app/api/flights/search/route.ts`
4. Update UI components in `components/search/*`
5. Test with real searches

#### When adding a new airline:
1. **ONLY** edit `lib/data/airlines.ts`
2. Add entry to `AIRLINES` object:
   ```typescript
   'XX': {
     code: 'XX',
     name: 'Example Airlines',
     website: 'https://www.example.com',
     bookingUrlTemplate: 'https://www.example.com/book?from={origin}&to={destination}&date={date}'
   }
   ```
3. **DO NOT** hardcode airline info anywhere else

#### When modifying UI:
1. Use existing components from `components/ui/*`
2. Follow Tailwind CSS conventions
3. Ensure responsive design (test mobile)
4. Maintain accessibility (ARIA labels, keyboard navigation)

#### When adding airports:
1. Edit `lib/data/airports.ts`
2. Add to appropriate array
3. If adding a city code, update `CITY_CODES` map

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: descriptive message"

# Push and create PR
git push -u origin feature/your-feature-name
```

**Commit message format**:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `style:` - Code style changes
- `test:` - Test changes

---

## Common Tasks

### Adding a New Feature

1. **Plan the changes**:
   - Identify affected files
   - Consider database schema changes
   - Plan API changes if needed

2. **Update types** (`types/index.ts`):
   ```typescript
   export interface NewFeature {
     // Define interface
   }
   ```

3. **Implement backend**:
   - Add to `lib/api/*` if needed
   - Create/modify API route in `app/api/*`
   - Update database schema if needed

4. **Implement frontend**:
   - Create/modify components in `components/*`
   - Update pages in `app/*`

5. **Test thoroughly**:
   - Manual testing with dev server
   - Check edge cases
   - Verify authentication

### Debugging Search Issues

1. **Check API credentials** - Verify `.env.local`
2. **Check API logs** - Look at browser console and server logs
3. **Verify airport codes** - Must be valid IATA codes
4. **Check cache** - May need to clear `flight_results_cache` table
5. **Test with simple route** - JFK→LAX is always reliable

### Debugging Authentication

1. **Verify Supabase setup** - Check credentials in `.env.local`
2. **Check RLS policies** - Ensure they're enabled in Supabase
3. **Clear cookies** - Auth state may be stale
4. **Check middleware** - Ensure `middleware.ts` is running

### Optimizing Performance

1. **Use caching** - 30-minute cache already implemented
2. **Limit API calls** - Creative routing uses ~11 calls per search
3. **Optimize database queries** - Use indexes (already in schema)
4. **Minimize client bundle** - Use dynamic imports for large components

---

## Important Constraints

### DO NOT:
1. ❌ **Hardcode airline information** - Always use `lib/data/airlines.ts`
2. ❌ **Skip authentication checks** - All API routes must verify user
3. ❌ **Use `any` type** - Always use proper TypeScript types
4. ❌ **Create custom CSS files** - Use Tailwind only
5. ❌ **Modify RLS policies without review** - Security critical
6. ❌ **Commit `.env.local`** - Already in `.gitignore`
7. ❌ **Change price sorting logic** - Must remain price-first
8. ❌ **Add dependencies without reason** - Keep bundle size small

### ALWAYS:
1. ✅ **Sort results by price** (lowest first)
2. ✅ **Use USD for all prices** (set in API calls)
3. ✅ **Filter out third-party operators** (airlines only)
4. ✅ **Check authentication** before API operations
5. ✅ **Use TypeScript** with strict mode
6. ✅ **Handle errors gracefully** with user-friendly messages
7. ✅ **Cache search results** (30-minute TTL)
8. ✅ **Use path aliases** (`@/` instead of relative paths)

### Security Rules:
1. **Never expose service role key** to client
2. **Always validate user input** on server side
3. **Use RLS policies** for data access control
4. **Sanitize database inputs** (use parameterized queries)
5. **HTTPS only** in production
6. **No secrets in code** (use environment variables)

---

## API Integration

### Amadeus API

**Base URL**: `https://test.api.amadeus.com` (test environment)

**Authentication**: OAuth 2.0 client credentials
```typescript
// In lib/api/amadeus.ts
const tokenResponse = await axios.post(
  'https://test.api.amadeus.com/v1/security/oauth2/token',
  { grant_type: 'client_credentials', ... }
);
```

**Flight Search Endpoint**:
- **URL**: `/v2/shopping/flight-offers`
- **Method**: POST
- **Rate Limit**: 10 TPS (test environment)

**Key Parameters**:
```typescript
{
  originLocationCode: 'JFK',
  destinationLocationCode: 'LAX',
  departureDate: '2025-12-01',
  adults: 1,
  currencyCode: 'USD',  // REQUIRED
  max: 15               // Number of results
}
```

**Response Processing**:
1. Filter out third-party operators (check `validatingAirlineCodes`)
2. Convert to our `FlightRoute` interface
3. Look up airline info from `lib/data/airlines.ts`
4. Generate booking URLs
5. Sort by price

**Creative Routing**:
- Searches through 5 major hubs per region
- Makes 2 API calls per hub (origin→hub, hub→destination)
- Combines results into multi-city routes
- Only shows if cheaper than direct

### City Code Expansion

**Function**: `expandCityCode()` in `lib/data/airports.ts`

**Supported City Codes**:
- NYC → JFK, LGA, EWR
- TYO → HND, NRT
- LON → LHR, LGW, LCY, STN, LTN
- SHA → PVG, SHA
- PAR → CDG, ORY
- CHI → ORD, MDW
- WAS → IAD, DCA, BWI
- And more... (see `airports.ts`)

**Usage**:
```typescript
const origins = expandCityCode('NYC');
// Returns: ['JFK', 'LGA', 'EWR']

const destinations = expandCityCode('LAX');
// Returns: ['LAX'] (single airport)
```

---

## Database Schema

### Tables

#### `saved_searches`
User's saved search parameters
- `user_id` - References auth.users
- `origin`, `destination` - Airport codes
- `departure_date`, `return_date` - ISO dates
- `adults`, `children`, `infants` - Passenger counts
- RLS: Users can only see their own searches

#### `flight_results_cache`
30-minute cache for API results
- `search_hash` - MD5 hash of search params (unique)
- `origin`, `destination`, `departure_date` - For indexing
- `results` - JSONB with full search results
- `expires_at` - Cache expiration timestamp
- No RLS (shared cache)

#### `user_preferences`
User settings and preferences
- `user_id` - Primary key, references auth.users
- `preferred_airlines`, `excluded_airlines` - Text arrays
- `max_layovers`, `preferred_cabin_class` - Search defaults
- `price_alerts_enabled` - Boolean flag
- RLS: Users can only access their own preferences

#### `price_alerts`
Price monitoring for routes
- `user_id`, `origin`, `destination` - Search criteria
- `target_price` - Alert threshold
- `is_active` - Enable/disable alerts
- RLS: Users can only see their own alerts

#### `search_history`
Analytics and user history
- `user_id` - References auth.users
- `search_params` - JSONB with search details
- `results_count`, `cheapest_price` - Metadata
- RLS: Users can only see their own history

### Indexes
```sql
CREATE INDEX idx_cache_hash ON flight_results_cache(search_hash);
CREATE INDEX idx_cache_expires ON flight_results_cache(expires_at);
CREATE INDEX idx_history_user ON search_history(user_id);
CREATE INDEX idx_alerts_user ON price_alerts(user_id);
```

### RLS Policies
All user tables have Row Level Security enabled:
```sql
-- Example for saved_searches
CREATE POLICY "Users can view own searches"
  ON saved_searches FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Testing & Deployment

### Manual Testing Checklist

**Search Functionality**:
- [ ] Direct flight search (JFK→LAX)
- [ ] Creative routing search (PVG→HND)
- [ ] City code search (NYC→TYO)
- [ ] Return flight search
- [ ] Multi-passenger search
- [ ] Different cabin classes

**Authentication**:
- [ ] Sign up new user
- [ ] Log in existing user
- [ ] Log out
- [ ] Protected route access

**Results Display**:
- [ ] Price sorting (lowest first)
- [ ] Airline names displayed correctly
- [ ] Booking links work
- [ ] Creative routing clearly marked

**Edge Cases**:
- [ ] No results found
- [ ] Invalid airport codes
- [ ] Past dates
- [ ] API errors
- [ ] Network failures

### Deployment to Vercel

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import to Vercel**:
   - Connect GitHub repository
   - Auto-detected as Next.js

3. **Set environment variables**:
   - Add all variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to Vercel URL

4. **Configure Supabase**:
   - Add Vercel URL to allowed redirect URLs
   - Update site URL in Supabase settings

5. **Deploy**:
   - Automatic on push to main branch

### Build Commands
```bash
# Development
npm run dev

# Production build (test locally)
npm run build
npm run start

# Linting
npm run lint
```

---

## Useful Resources

### Documentation Files
- `README.md` - Project overview and features
- `SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_START.md` - 5-minute quick start
- `AIRPORT_AUTOCOMPLETE.md` - Autocomplete feature docs

### External Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Amadeus API Docs](https://developers.amadeus.com/self-service)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Key Concepts to Understand
1. **Next.js App Router** - Server vs client components
2. **Supabase RLS** - Row Level Security policies
3. **Amadeus API** - Flight offer structure
4. **Creative Routing** - Hub-based search algorithm
5. **City Codes** - IATA city codes vs airport codes

---

## Common Pitfalls to Avoid

1. **Forgetting to await Supabase calls** - All Supabase operations are async
2. **Not handling null user** - Always check authentication result
3. **Hardcoding airline URLs** - Use `lib/data/airlines.ts`
4. **Ignoring cache** - Check cache before making API calls
5. **Not sorting by price** - Critical feature, must maintain
6. **Missing TypeScript types** - Strict mode catches this
7. **Exposing service role key** - Only use server-side
8. **Not expanding city codes** - Use `expandCityCode()` helper
9. **Breaking price sorting** - Results MUST be price-first
10. **Modifying RLS without review** - Security implications

---

## Questions to Ask Before Making Changes

1. **Does this affect search results ordering?** → Don't break price-first sorting
2. **Does this require new environment variables?** → Document them
3. **Does this change the database schema?** → Update `supabase-schema.sql`
4. **Does this add airline data?** → Use `lib/data/airlines.ts` only
5. **Does this affect authentication?** → Test thoroughly
6. **Does this increase API calls?** → Consider rate limits
7. **Does this break existing features?** → Test all search paths
8. **Does this change user-facing text?** → Keep it clear and concise
9. **Does this affect mobile users?** → Test responsive design
10. **Is this the simplest solution?** → Prefer simple over clever

---

## Contact & Support

For questions about this codebase:
1. Read this document first
2. Check existing documentation in `README.md`, `SETUP_GUIDE.md`
3. Review code in relevant files
4. Check git history for context on changes

**Key Files for Common Questions**:
- Search not working? → `lib/api/amadeus.ts`, `lib/api/flightEngine.ts`
- Auth issues? → `lib/supabase/*`, `middleware.ts`
- UI problems? → `components/search/*`
- Database issues? → `supabase-schema.sql`, `app/api/flights/search/route.ts`
- Type errors? → `types/index.ts`

---

**Version**: 1.0
**Last Updated**: 2025-11-22
**Maintainer**: Project Team
