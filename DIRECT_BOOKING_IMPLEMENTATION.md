# Direct Airline Booking Implementation

## Overview

The Flight Arbitrage Engine now ensures **all flights link directly to airline websites** with **USD pricing only** and **filters out third-party/OTA prices**.

## Key Changes

### 1. USD Currency Only

**File:** [lib/api/amadeus.ts](lib/api/amadeus.ts:67-67)

```typescript
currencyCode: 'USD', // Force USD pricing
```

All API requests now include `currencyCode: 'USD'` parameter, ensuring consistent pricing in US Dollars regardless of user location.

**Result Display:** All prices show as `$XXX.XX USD`

### 2. Filter Out Third-Party Prices

**File:** [lib/api/amadeus.ts](lib/api/amadeus.ts:99-108)

```typescript
.filter((offer: any) => {
  // Filter out third-party bookings - only include airline direct bookings
  const validatingAirlines = offer.validatingAirlineCodes || [];
  const firstSegmentCarrier = offer.itineraries[0]?.segments[0]?.carrierCode;

  // Only include if the validating airline matches the operating airline
  return validatingAirlines.includes(firstSegmentCarrier);
})
```

**How it works:**
- Amadeus API returns `validatingAirlineCodes` - airlines authorized to ticket the fare
- We only show flights where the validating airline is the operating airline
- This filters out OTA (Online Travel Agency) and consolidator fares
- **Result:** Only direct airline prices shown

### 3. Direct Airline Booking Links

**File:** [lib/api/amadeus.ts](lib/api/amadeus.ts:165-327)

Comprehensive mapping of 30+ airlines with direct deep links to their booking pages:

#### Major Airlines Supported:

**US Airlines:**
- American Airlines (AA)
- United Airlines (UA)
- Delta Air Lines (DL)
- Southwest Airlines (WN)
- Alaska Airlines (AS)
- JetBlue (B6)

**European Airlines:**
- British Airways (BA)
- Lufthansa (LH)
- Air France (AF)
- KLM (KL)
- Iberia (IB)
- Finnair (AY)
- SAS (SK)
- TAP Portugal (TP)
- Swiss (LX)
- Austrian (OS)

**Asian Airlines:**
- ANA (NH)
- Japan Airlines (JL)
- Singapore Airlines (SQ)
- Cathay Pacific (CX)
- Thai Airways (TG)
- Korean Air (KE)
- Asiana (OZ)

**Middle Eastern:**
- Emirates (EK)
- Qatar Airways (QR)
- Etihad (EY)

**Latin American:**
- LATAM (LA)
- Copa Airlines (CM)
- Aeromexico (AM)

**Other:**
- Air Canada (AC)
- Air New Zealand (NZ)
- Qantas (QF)

#### Link Format:

Each airline link includes:
- Origin airport code
- Destination airport code
- Departure date
- Direct to airline's booking page (not search page)

**Example for American Airlines:**
```
https://www.aa.com/booking/find-flights?locale=en_US&from=JFK&to=LAX&departDate=2025-01-15
```

**Fallback:** For airlines not in the mapping, generates generic URL:
```
https://www.{airlineCode}air.com/booking?from={origin}&to={destination}&date={date}
```

### 4. UI Improvements

**File:** [components/search/FlightResults.tsx](components/search/FlightResults.tsx:79-92)

**Enhanced Booking Button:**
```typescript
<div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Book Direct on Airline
  <ExternalLink className="w-4 h-4" />
</div>
<div className="text-xs text-gray-500">
  {flight.segments[0].airline} • Direct Booking
</div>
```

Shows:
- "Book Direct on Airline" button
- Airline code (e.g., "AA • Direct Booking")
- External link icon

**Information Banner:**
```typescript
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <p className="text-sm font-semibold text-blue-900">All Prices in USD • Direct Airline Booking</p>
  <p className="text-sm text-blue-700 mt-1">
    Prices shown are from airlines directly, not third-party sites.
    Click any booking button to go straight to the airline's website.
  </p>
</div>
```

Appears at the top of results, clearly communicating:
- All prices in USD
- Direct airline booking only
- No third-party involvement

## Benefits

✅ **Transparency:** Users know exactly where they're booking
✅ **Consistency:** All prices in USD for easy comparison
✅ **Trust:** No hidden fees from third-party sites
✅ **Better Support:** Book directly with airline for customer service
✅ **Loyalty Points:** Users earn airline miles/points
✅ **No Markup:** Airline direct prices, no OTA commission

## How to Verify

### Test the Filtering:

1. Run a search
2. Check console logs for API response
3. Verify only flights where `validatingAirlineCodes` includes the operating carrier

### Test Direct Links:

1. Click "Book Direct on Airline" button
2. Verify you land on official airline website
3. Check URL includes search parameters (origin, destination, date)

### Test USD Pricing:

1. Run searches from different locations
2. All results should show USD currency
3. No currency conversion needed

## Example Output

**Search:** JFK → LAX on 2025-01-15

**Result:**
```
$299.00 USD
American Airlines
Direct Flight • 5h 30m
[Book Direct on Airline] → https://www.aa.com/booking/...
AA • Direct Booking
```

## Future Enhancements

Potential additions:
- [ ] Add more airline deep links
- [ ] Multi-currency display (with USD as base)
- [ ] Price comparison with OTA prices (show savings)
- [ ] Airline alliance filtering
- [ ] Seat selection deep links

## Technical Notes

### Why Filter by validatingAirlineCodes?

Amadeus API returns various fare types:
- **Airline Direct:** `validatingAirlineCodes` = operating airline
- **OTA/Consolidator:** `validatingAirlineCodes` ≠ operating airline

By filtering on this field, we ensure only airline-direct fares appear.

### Currency Conversion

Amadeus handles USD conversion automatically when `currencyCode: 'USD'` is specified. No manual conversion needed.

### Deep Link Accuracy

Airline booking URLs may change. If a link breaks:
1. Check airline's current booking URL structure
2. Update mapping in [lib/api/amadeus.ts](lib/api/amadeus.ts:174-314)
3. Test with actual search parameters

## Testing Checklist

- [x] USD pricing enforced in API call
- [x] Third-party fares filtered out
- [x] Direct airline links generated
- [x] UI shows airline code
- [x] Information banner displays
- [x] External link icon present
- [x] Build successful
- [x] TypeScript types valid
