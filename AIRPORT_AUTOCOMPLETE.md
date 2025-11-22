# Airport Autocomplete Feature

## Overview

The Flight Arbitrage Engine now includes **intelligent airport autocomplete** with support for city-wide airport codes, making it easier to search for flights across multiple airports in major cities.

## Features

### 1. **Smart Autocomplete**
- Search by airport code (e.g., "JFK")
- Search by city name (e.g., "New York")
- Search by airport name (e.g., "Kennedy")
- Search by country (e.g., "United States")

### 2. **City-Wide Codes** ⭐
City codes automatically search **all airports** in that metropolitan area:

| City Code | City | Airports Included |
|-----------|------|-------------------|
| **NYC** | New York | JFK, LGA, EWR |
| **TYO** | Tokyo | HND, NRT |
| **LON** | London | LHR, LGW, LCY, STN, LTN |
| **SHA** | Shanghai | PVG, SHA |
| **PAR** | Paris | CDG, ORY |
| **CHI** | Chicago | ORD, MDW |
| **WAS** | Washington DC | IAD, DCA, BWI |
| **SFO** | San Francisco | SFO, OAK, SJC |
| **MIL** | Milan | MXP, LIN, BGY |
| **SEL** | Seoul | ICN, GMP |
| **BKK** | Bangkok | BKK, DMK |
| **MOW** | Moscow | SVO, DME, VKO |

### 3. **Visual Indicators**
- 🛫 **Blue plane icon**: Individual airport
- 📍 **Purple pin icon**: City-wide code (multiple airports)
- **Purple badge**: "ALL AIRPORTS" tag on city codes

### 4. **Keyboard Navigation**
- `Arrow Down`: Move to next suggestion
- `Arrow Up`: Move to previous suggestion
- `Enter`: Select highlighted suggestion
- `Escape`: Close suggestions

## Usage Examples

### Example 1: City-Wide Search
```
Search: NYC → LAX

Expands to:
- JFK → LAX
- LGA → LAX
- EWR → LAX

Result: Shows cheapest flight from ANY New York airport to LAX
```

### Example 2: City to City
```
Search: TYO → NYC

Expands to:
- HND → JFK
- HND → LGA
- HND → EWR
- NRT → JFK
- NRT → LGA
- NRT → EWR

Result: Shows ALL combinations, sorted by price
```

### Example 3: Specific Airport
```
Search: JFK → HND

Result: Only JFK to HND flights (no expansion)
```

## How It Works

### Frontend (Autocomplete Component)

**File**: [components/ui/airport-autocomplete.tsx](components/ui/airport-autocomplete.tsx)

```typescript
// User types "tok" or "TYO"
searchAirports("tok", 8);

// Returns:
[
  {
    code: 'TYO',
    name: 'Tokyo (All Airports)',
    city: 'Tokyo',
    country: 'Japan',
    type: 'city',
    airports: ['HND', 'NRT']
  },
  {
    code: 'HND',
    name: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan',
    type: 'airport'
  },
  // ...
]
```

### Backend (City Code Expansion)

**File**: [lib/api/flightEngine.ts](lib/api/flightEngine.ts)

```typescript
// User searches: NYC → LAX
const origins = expandCityCode('NYC');      // ['JFK', 'LGA', 'EWR']
const destinations = expandCityCode('LAX'); // ['LAX', 'BUR', 'ONT', 'SNA', 'LGB']

// Searches all combinations:
for (const origin of origins) {
  for (const destination of destinations) {
    searchFlights({ origin, destination, ... });
  }
}

// Deduplicates and sorts by price
```

## Airport Database

**File**: [lib/data/airports.ts](lib/data/airports.ts)

Contains **140+ airports** and **12 city codes** across:
- 🇺🇸 United States (30+ airports)
- 🇯🇵 Japan (5 airports)
- 🇨🇳 China (6 airports)
- 🇰🇷 South Korea (3 airports)
- 🇸🇬 Singapore, 🇭🇰 Hong Kong, 🇹🇼 Taiwan
- 🇬🇧 United Kingdom (7 airports)
- 🇫🇷 France, 🇩🇪 Germany, 🇳🇱 Netherlands
- 🇪🇸 Spain, 🇮🇹 Italy, 🇨🇭 Switzerland
- 🇦🇪 UAE, 🇶🇦 Qatar (Middle East hubs)
- 🇦🇺 Australia, 🇳🇿 New Zealand
- 🇨🇦 Canada, 🇲🇽 Mexico, 🇧🇷 Brazil

### Adding New Airports

To add more airports, edit [lib/data/airports.ts](lib/data/airports.ts):

```typescript
export const AIRPORTS: Record<string, Airport> = {
  // Add individual airport
  'LAX': {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
    type: 'airport'
  },

  // Add city code
  'LAC': {
    code: 'LAC',
    name: 'Los Angeles Area (All Airports)',
    city: 'Los Angeles',
    country: 'United States',
    type: 'city',
    airports: ['LAX', 'BUR', 'ONT', 'SNA', 'LGB']
  },
};
```

## API Functions

### Search Function
```typescript
import { searchAirports } from '@/lib/data/airports';

const results = searchAirports('new york', 10);
// Returns up to 10 matching airports
```

### Get Airport Info
```typescript
import { getAirport } from '@/lib/data/airports';

const airport = getAirport('JFK');
// Returns airport details or null
```

### Expand City Code
```typescript
import { expandCityCode } from '@/lib/data/airports';

const airports = expandCityCode('NYC');
// Returns: ['JFK', 'LGA', 'EWR']

const single = expandCityCode('JFK');
// Returns: ['JFK'] (not a city code)
```

### Check if City Code
```typescript
import { isCityCode } from '@/lib/data/airports';

isCityCode('NYC'); // true
isCityCode('JFK'); // false
```

### Format for Display
```typescript
import { formatAirportDisplay } from '@/lib/data/airports';

const airport = getAirport('TYO');
formatAirportDisplay(airport);
// Returns: "TYO - Tokyo (All Airports)"
```

## UI Components

### AirportAutocomplete Component

**Props:**
```typescript
interface AirportAutocompleteProps {
  value: string;              // Current airport code
  onChange: (value: string) => void;  // Callback when selection changes
  placeholder?: string;       // Placeholder text
  label?: string;            // Field label
  id?: string;               // HTML id attribute
  required?: boolean;        // Is field required
}
```

**Usage:**
```tsx
<AirportAutocomplete
  value={origin}
  onChange={setOrigin}
  label="From"
  placeholder="JFK, NYC, New York..."
  id="origin"
  required
/>
```

## Performance

### Autocomplete Search
- **Local search**: No API calls, instant results
- **In-memory lookup**: ~0.1ms per search
- **Cached results**: Only searches when input changes

### City Code Expansion
- **Multiple API calls**: One per airport combination
- **Example**: NYC → LAX
  - 3 origins × 5 destinations = 15 API calls
  - Runs in parallel for performance
  - Results deduplicated and sorted

### Optimization Tips
- Use specific airports when possible (fewer API calls)
- City codes best for flexibility (finding cheapest option)
- Results are cached for 30 minutes

## Benefits

### For Users
✅ **Easier to use**: Type city names instead of codes
✅ **More flexibility**: Search all airports at once
✅ **Better deals**: Compare prices across all area airports
✅ **Clear visual feedback**: See which codes are city-wide

### For Developers
✅ **Centralized data**: Single source of truth
✅ **Type-safe**: Full TypeScript support
✅ **Extensible**: Easy to add new airports
✅ **Performant**: Local search, no external API

## Example Scenarios

### Scenario 1: Business Travel
**User**: "I need to get from New York to London for a meeting"

**Search**: NYC → LON

**What happens**:
- Searches all NY airports (JFK, LGA, EWR)
- To all London airports (LHR, LGW, LCY, STN, LTN)
- Shows cheapest combination

**Result**: Finds EWR → LGW for $350 (cheaper than JFK → LHR at $450)

### Scenario 2: Vacation Planning
**User**: "Flying to Tokyo for vacation, flexible on which airport"

**Search**: LAX → TYO

**What happens**:
- LAX is specific airport
- TYO expands to HND and NRT
- Searches: LAX → HND and LAX → NRT

**Result**: Shows both options, Haneda is $50 cheaper

### Scenario 3: Specific Route
**User**: "I know I want JFK to Heathrow specifically"

**Search**: JFK → LHR

**What happens**:
- Both are specific airports
- Single API call
- Fast results

**Result**: Direct JFK → LHR flights only

## Testing

### Manual Testing Checklist
- [ ] Type "NYC" - shows city code with 3 airports
- [ ] Type "New York" - shows JFK, LGA, EWR, NYC
- [ ] Type "JFK" - shows JFK first (exact match)
- [ ] Search NYC → LAX - shows combined results
- [ ] Keyboard navigation works (arrows, enter, escape)
- [ ] Click on city code - displays purple badge
- [ ] Click on airport - selects correctly
- [ ] Form validation works with codes

### Unit Tests
```typescript
// Test city code expansion
expect(expandCityCode('NYC')).toEqual(['JFK', 'LGA', 'EWR']);
expect(expandCityCode('JFK')).toEqual(['JFK']);

// Test search
const results = searchAirports('tokyo');
expect(results).toContainEqual(expect.objectContaining({ code: 'TYO' }));
expect(results).toContainEqual(expect.objectContaining({ code: 'HND' }));

// Test exact match priority
const nyResults = searchAirports('JFK');
expect(nyResults[0].code).toBe('JFK');
```

## Future Enhancements

Potential improvements:
- [ ] Add more airports (budget airlines, regional)
- [ ] Region-based filtering (domestic/international)
- [ ] Popular route suggestions
- [ ] Recent searches history
- [ ] Airport info tooltips (terminals, amenities)
- [ ] Distance and travel time to city center
- [ ] Multi-language airport names

## Migration Notes

**Before:**
```tsx
<input
  type="text"
  value={origin}
  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
  placeholder="e.g., JFK"
  maxLength={3}
/>
```

**After:**
```tsx
<AirportAutocomplete
  value={origin}
  onChange={setOrigin}
  placeholder="JFK, NYC, New York..."
/>
```

## Summary

The airport autocomplete feature makes flight searching:
- **Easier**: Type city names, not codes
- **Smarter**: Automatic city-wide searches
- **Faster**: Instant suggestions, no typing errors
- **Better**: Find the absolute cheapest option across all airports

Perfect for users who want maximum flexibility and best prices! ✈️💰
