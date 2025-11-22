# Refactor Notes - Amadeus Only

## Changes Made

The application has been refactored to use **only Amadeus API** instead of multiple flight APIs.

### What Was Removed

- ❌ Kiwi (Tequila) API integration
- ❌ Skyscanner API references
- ❌ `lib/api/kiwi.ts` file

### What Changed

1. **Flight Search Engine** ([lib/api/flightEngine.ts](lib/api/flightEngine.ts:1-200))
   - Now uses only AmadeusAPI
   - Creative routing implemented entirely with Amadeus
   - Makes separate API calls for each leg (origin → hub, hub → destination)
   - Searches top 5 relevant hubs in parallel

2. **Environment Variables**
   - Removed: `KIWI_API_KEY`, `SKYSCANNER_API_KEY`
   - Kept: `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`
   - Updated [.env.example](.env.example:1-11) and [.env.local](.env.local:1-13)

3. **Vercel Configuration** ([vercel.json](vercel.json:1-14))
   - Removed Kiwi API key reference

4. **Documentation**
   - Updated [README.md](README.md:1-215)
   - Updated landing page ([app/page.tsx](app/page.tsx:1-139))
   - Updated search page footer

## How Creative Routing Works Now

Instead of using Kiwi's multi-city search:

1. **Identifies relevant hubs** based on route geography (Asia, Europe, Middle East, etc.)
2. **Makes parallel searches** using Amadeus:
   - Searches for leg 1: origin → hub (one-way)
   - Searches for leg 2: hub → destination (one-way)
3. **Combines cheapest options** from each leg
4. **Compares total price** against direct flights
5. **Shows savings** when booking separately is cheaper

### Example Flow

For PVG (Shanghai) → HND (Tokyo):
- Searches PVG → ICN (Seoul) via Amadeus
- Searches ICN → HND via Amadeus
- If PVG→ICN ($200) + ICN→HND ($150) = $350 < direct PVG→HND ($500)
- Shows as creative routing option with $150 savings

## API Usage

**Single API calls per search:**
- Direct flights: 1 Amadeus API call
- Creative routing: 2 × number of hubs checked (default 5 hubs = 10 calls)

**Total for full search with creative routing:** ~11 API calls

**Caching:**
- Results cached for 30 minutes
- Significantly reduces API usage for repeat searches

## Benefits

✅ **Simplified architecture** - One API integration instead of multiple
✅ **Consistent data format** - All results from single source
✅ **Easier to maintain** - Fewer dependencies
✅ **Cost-effective** - Amadeus test environment is free
✅ **Still finds savings** - Creative routing works with Amadeus alone

## Limitations

⚠️ **More API calls** - Creative routing makes multiple calls to same API
⚠️ **Rate limiting** - Stay within Amadeus 10 TPS limit in test environment
⚠️ **Cache important** - Essential for good performance with creative routing

## Migration Notes

If you already have the app running:

1. Remove Kiwi/Skyscanner keys from `.env.local`
2. Keep only Amadeus credentials
3. Restart the dev server
4. Clear any cached results (optional)

No database changes needed - all existing data is compatible.
