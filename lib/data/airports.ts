/**
 * Comprehensive airport database with city-wide codes
 * Supports autocomplete and city-level searches
 */

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  type: 'airport' | 'city'; // city codes aggregate multiple airports
  airports?: string[]; // for city codes, list of airport codes
}

export const AIRPORTS: Record<string, Airport> = {
  // === CITY-WIDE CODES ===

  // Tokyo Area
  'TYO': {
    code: 'TYO',
    name: 'Tokyo (All Airports)',
    city: 'Tokyo',
    country: 'Japan',
    type: 'city',
    airports: ['HND', 'NRT']
  },

  // New York Area
  'NYC': {
    code: 'NYC',
    name: 'New York (All Airports)',
    city: 'New York',
    country: 'United States',
    type: 'city',
    airports: ['JFK', 'LGA', 'EWR']
  },

  // London Area
  'LON': {
    code: 'LON',
    name: 'London (All Airports)',
    city: 'London',
    country: 'United Kingdom',
    type: 'city',
    airports: ['LHR', 'LGW', 'LCY', 'STN', 'LTN']
  },

  // Paris Area
  'PAR': {
    code: 'PAR',
    name: 'Paris (All Airports)',
    city: 'Paris',
    country: 'France',
    type: 'city',
    airports: ['CDG', 'ORY']
  },

  // Shanghai Area
  'SHA': {
    code: 'SHA',
    name: 'Shanghai (All Airports)',
    city: 'Shanghai',
    country: 'China',
    type: 'city',
    airports: ['PVG', 'SHA']
  },

  // Los Angeles Area
  'LAX': {
    code: 'LAX',
    name: 'Los Angeles (All Airports)',
    city: 'Los Angeles',
    country: 'United States',
    type: 'city',
    airports: ['LAX', 'BUR', 'ONT', 'SNA', 'LGB']
  },

  // Chicago Area
  'CHI': {
    code: 'CHI',
    name: 'Chicago (All Airports)',
    city: 'Chicago',
    country: 'United States',
    type: 'city',
    airports: ['ORD', 'MDW']
  },

  // Washington DC Area
  'WAS': {
    code: 'WAS',
    name: 'Washington DC (All Airports)',
    city: 'Washington',
    country: 'United States',
    type: 'city',
    airports: ['IAD', 'DCA', 'BWI']
  },

  // San Francisco Area
  'SFO': {
    code: 'SFO',
    name: 'San Francisco Bay Area (All Airports)',
    city: 'San Francisco',
    country: 'United States',
    type: 'city',
    airports: ['SFO', 'OAK', 'SJC']
  },

  // Milan Area
  'MIL': {
    code: 'MIL',
    name: 'Milan (All Airports)',
    city: 'Milan',
    country: 'Italy',
    type: 'city',
    airports: ['MXP', 'LIN', 'BGY']
  },

  // Moscow Area
  'MOW': {
    code: 'MOW',
    name: 'Moscow (All Airports)',
    city: 'Moscow',
    country: 'Russia',
    type: 'city',
    airports: ['SVO', 'DME', 'VKO']
  },

  // Bangkok Area
  'BKK': {
    code: 'BKK',
    name: 'Bangkok (All Airports)',
    city: 'Bangkok',
    country: 'Thailand',
    type: 'city',
    airports: ['BKK', 'DMK']
  },

  // Seoul Area
  'SEL': {
    code: 'SEL',
    name: 'Seoul (All Airports)',
    city: 'Seoul',
    country: 'South Korea',
    type: 'city',
    airports: ['ICN', 'GMP']
  },

  // === INDIVIDUAL AIRPORTS ===

  // United States - Major Airports
  'JFK': {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
    type: 'airport'
  },
  'LGA': {
    code: 'LGA',
    name: 'LaGuardia Airport',
    city: 'New York',
    country: 'United States',
    type: 'airport'
  },
  'EWR': {
    code: 'EWR',
    name: 'Newark Liberty International Airport',
    city: 'Newark',
    country: 'United States',
    type: 'airport'
  },
  'ORD': {
    code: 'ORD',
    name: "O'Hare International Airport",
    city: 'Chicago',
    country: 'United States',
    type: 'airport'
  },
  'MDW': {
    code: 'MDW',
    name: 'Chicago Midway International Airport',
    city: 'Chicago',
    country: 'United States',
    type: 'airport'
  },
  'ATL': {
    code: 'ATL',
    name: 'Hartsfield-Jackson Atlanta International Airport',
    city: 'Atlanta',
    country: 'United States',
    type: 'airport'
  },
  'DFW': {
    code: 'DFW',
    name: 'Dallas/Fort Worth International Airport',
    city: 'Dallas',
    country: 'United States',
    type: 'airport'
  },
  'DEN': {
    code: 'DEN',
    name: 'Denver International Airport',
    city: 'Denver',
    country: 'United States',
    type: 'airport'
  },
  'MIA': {
    code: 'MIA',
    name: 'Miami International Airport',
    city: 'Miami',
    country: 'United States',
    type: 'airport'
  },
  'SEA': {
    code: 'SEA',
    name: 'Seattle-Tacoma International Airport',
    city: 'Seattle',
    country: 'United States',
    type: 'airport'
  },
  'BOS': {
    code: 'BOS',
    name: 'Boston Logan International Airport',
    city: 'Boston',
    country: 'United States',
    type: 'airport'
  },
  'IAD': {
    code: 'IAD',
    name: 'Washington Dulles International Airport',
    city: 'Washington',
    country: 'United States',
    type: 'airport'
  },
  'DCA': {
    code: 'DCA',
    name: 'Ronald Reagan Washington National Airport',
    city: 'Washington',
    country: 'United States',
    type: 'airport'
  },
  'BWI': {
    code: 'BWI',
    name: 'Baltimore/Washington International Airport',
    city: 'Baltimore',
    country: 'United States',
    type: 'airport'
  },
  'LAS': {
    code: 'LAS',
    name: 'Harry Reid International Airport',
    city: 'Las Vegas',
    country: 'United States',
    type: 'airport'
  },
  'PHX': {
    code: 'PHX',
    name: 'Phoenix Sky Harbor International Airport',
    city: 'Phoenix',
    country: 'United States',
    type: 'airport'
  },
  'MCO': {
    code: 'MCO',
    name: 'Orlando International Airport',
    city: 'Orlando',
    country: 'United States',
    type: 'airport'
  },

  // Asia - Japan
  'HND': {
    code: 'HND',
    name: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan',
    type: 'airport'
  },
  'NRT': {
    code: 'NRT',
    name: 'Narita International Airport',
    city: 'Tokyo',
    country: 'Japan',
    type: 'airport'
  },
  'KIX': {
    code: 'KIX',
    name: 'Kansai International Airport',
    city: 'Osaka',
    country: 'Japan',
    type: 'airport'
  },
  'NGO': {
    code: 'NGO',
    name: 'Chubu Centrair International Airport',
    city: 'Nagoya',
    country: 'Japan',
    type: 'airport'
  },
  'FUK': {
    code: 'FUK',
    name: 'Fukuoka Airport',
    city: 'Fukuoka',
    country: 'Japan',
    type: 'airport'
  },

  // Asia - China
  'PVG': {
    code: 'PVG',
    name: 'Shanghai Pudong International Airport',
    city: 'Shanghai',
    country: 'China',
    type: 'airport'
  },
  'PEK': {
    code: 'PEK',
    name: 'Beijing Capital International Airport',
    city: 'Beijing',
    country: 'China',
    type: 'airport'
  },
  'PKX': {
    code: 'PKX',
    name: 'Beijing Daxing International Airport',
    city: 'Beijing',
    country: 'China',
    type: 'airport'
  },
  'CAN': {
    code: 'CAN',
    name: 'Guangzhou Baiyun International Airport',
    city: 'Guangzhou',
    country: 'China',
    type: 'airport'
  },
  'CTU': {
    code: 'CTU',
    name: 'Chengdu Shuangliu International Airport',
    city: 'Chengdu',
    country: 'China',
    type: 'airport'
  },
  'SZX': {
    code: 'SZX',
    name: 'Shenzhen Bao\'an International Airport',
    city: 'Shenzhen',
    country: 'China',
    type: 'airport'
  },

  // Asia - South Korea
  'ICN': {
    code: 'ICN',
    name: 'Incheon International Airport',
    city: 'Seoul',
    country: 'South Korea',
    type: 'airport'
  },
  'GMP': {
    code: 'GMP',
    name: 'Gimpo International Airport',
    city: 'Seoul',
    country: 'South Korea',
    type: 'airport'
  },
  'PUS': {
    code: 'PUS',
    name: 'Gimhae International Airport',
    city: 'Busan',
    country: 'South Korea',
    type: 'airport'
  },

  // Asia - Southeast Asia
  'SIN': {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    type: 'airport'
  },
  'DMK': {
    code: 'DMK',
    name: 'Don Mueang International Airport',
    city: 'Bangkok',
    country: 'Thailand',
    type: 'airport'
  },
  'HKG': {
    code: 'HKG',
    name: 'Hong Kong International Airport',
    city: 'Hong Kong',
    country: 'Hong Kong',
    type: 'airport'
  },
  'TPE': {
    code: 'TPE',
    name: 'Taiwan Taoyuan International Airport',
    city: 'Taipei',
    country: 'Taiwan',
    type: 'airport'
  },
  'MNL': {
    code: 'MNL',
    name: 'Ninoy Aquino International Airport',
    city: 'Manila',
    country: 'Philippines',
    type: 'airport'
  },
  'CGK': {
    code: 'CGK',
    name: 'Soekarno-Hatta International Airport',
    city: 'Jakarta',
    country: 'Indonesia',
    type: 'airport'
  },
  'KUL': {
    code: 'KUL',
    name: 'Kuala Lumpur International Airport',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    type: 'airport'
  },

  // Europe - United Kingdom
  'LHR': {
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    type: 'airport'
  },
  'LGW': {
    code: 'LGW',
    name: 'London Gatwick Airport',
    city: 'London',
    country: 'United Kingdom',
    type: 'airport'
  },
  'LCY': {
    code: 'LCY',
    name: 'London City Airport',
    city: 'London',
    country: 'United Kingdom',
    type: 'airport'
  },
  'STN': {
    code: 'STN',
    name: 'London Stansted Airport',
    city: 'London',
    country: 'United Kingdom',
    type: 'airport'
  },
  'LTN': {
    code: 'LTN',
    name: 'London Luton Airport',
    city: 'London',
    country: 'United Kingdom',
    type: 'airport'
  },
  'MAN': {
    code: 'MAN',
    name: 'Manchester Airport',
    city: 'Manchester',
    country: 'United Kingdom',
    type: 'airport'
  },
  'EDI': {
    code: 'EDI',
    name: 'Edinburgh Airport',
    city: 'Edinburgh',
    country: 'United Kingdom',
    type: 'airport'
  },

  // Europe - France
  'CDG': {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    type: 'airport'
  },
  'ORY': {
    code: 'ORY',
    name: 'Paris Orly Airport',
    city: 'Paris',
    country: 'France',
    type: 'airport'
  },
  'NCE': {
    code: 'NCE',
    name: 'Nice Côte d\'Azur Airport',
    city: 'Nice',
    country: 'France',
    type: 'airport'
  },
  'LYS': {
    code: 'LYS',
    name: 'Lyon-Saint Exupéry Airport',
    city: 'Lyon',
    country: 'France',
    type: 'airport'
  },

  // Europe - Germany
  'FRA': {
    code: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany',
    type: 'airport'
  },
  'MUC': {
    code: 'MUC',
    name: 'Munich Airport',
    city: 'Munich',
    country: 'Germany',
    type: 'airport'
  },
  'BER': {
    code: 'BER',
    name: 'Berlin Brandenburg Airport',
    city: 'Berlin',
    country: 'Germany',
    type: 'airport'
  },
  'DUS': {
    code: 'DUS',
    name: 'Düsseldorf Airport',
    city: 'Düsseldorf',
    country: 'Germany',
    type: 'airport'
  },
  'HAM': {
    code: 'HAM',
    name: 'Hamburg Airport',
    city: 'Hamburg',
    country: 'Germany',
    type: 'airport'
  },

  // Europe - Other
  'AMS': {
    code: 'AMS',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands',
    type: 'airport'
  },
  'MAD': {
    code: 'MAD',
    name: 'Adolfo Suárez Madrid-Barajas Airport',
    city: 'Madrid',
    country: 'Spain',
    type: 'airport'
  },
  'BCN': {
    code: 'BCN',
    name: 'Barcelona-El Prat Airport',
    city: 'Barcelona',
    country: 'Spain',
    type: 'airport'
  },
  'FCO': {
    code: 'FCO',
    name: 'Leonardo da Vinci-Fiumicino Airport',
    city: 'Rome',
    country: 'Italy',
    type: 'airport'
  },
  'MXP': {
    code: 'MXP',
    name: 'Milan Malpensa Airport',
    city: 'Milan',
    country: 'Italy',
    type: 'airport'
  },
  'LIN': {
    code: 'LIN',
    name: 'Milan Linate Airport',
    city: 'Milan',
    country: 'Italy',
    type: 'airport'
  },
  'BGY': {
    code: 'BGY',
    name: 'Milan Bergamo Airport',
    city: 'Milan',
    country: 'Italy',
    type: 'airport'
  },
  'VCE': {
    code: 'VCE',
    name: 'Venice Marco Polo Airport',
    city: 'Venice',
    country: 'Italy',
    type: 'airport'
  },
  'ZRH': {
    code: 'ZRH',
    name: 'Zurich Airport',
    city: 'Zurich',
    country: 'Switzerland',
    type: 'airport'
  },
  'VIE': {
    code: 'VIE',
    name: 'Vienna International Airport',
    city: 'Vienna',
    country: 'Austria',
    type: 'airport'
  },
  'CPH': {
    code: 'CPH',
    name: 'Copenhagen Airport',
    city: 'Copenhagen',
    country: 'Denmark',
    type: 'airport'
  },
  'ARN': {
    code: 'ARN',
    name: 'Stockholm Arlanda Airport',
    city: 'Stockholm',
    country: 'Sweden',
    type: 'airport'
  },
  'OSL': {
    code: 'OSL',
    name: 'Oslo Airport',
    city: 'Oslo',
    country: 'Norway',
    type: 'airport'
  },
  'HEL': {
    code: 'HEL',
    name: 'Helsinki-Vantaa Airport',
    city: 'Helsinki',
    country: 'Finland',
    type: 'airport'
  },
  'IST': {
    code: 'IST',
    name: 'Istanbul Airport',
    city: 'Istanbul',
    country: 'Turkey',
    type: 'airport'
  },
  'SAW': {
    code: 'SAW',
    name: 'Sabiha Gökçen Airport',
    city: 'Istanbul',
    country: 'Turkey',
    type: 'airport'
  },

  // Middle East
  'DXB': {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    type: 'airport'
  },
  'DWC': {
    code: 'DWC',
    name: 'Al Maktoum International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    type: 'airport'
  },
  'DOH': {
    code: 'DOH',
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar',
    type: 'airport'
  },
  'AUH': {
    code: 'AUH',
    name: 'Abu Dhabi International Airport',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    type: 'airport'
  },
  'CAI': {
    code: 'CAI',
    name: 'Cairo International Airport',
    city: 'Cairo',
    country: 'Egypt',
    type: 'airport'
  },
  'TLV': {
    code: 'TLV',
    name: 'Ben Gurion Airport',
    city: 'Tel Aviv',
    country: 'Israel',
    type: 'airport'
  },

  // Oceania
  'SYD': {
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    city: 'Sydney',
    country: 'Australia',
    type: 'airport'
  },
  'MEL': {
    code: 'MEL',
    name: 'Melbourne Airport',
    city: 'Melbourne',
    country: 'Australia',
    type: 'airport'
  },
  'BNE': {
    code: 'BNE',
    name: 'Brisbane Airport',
    city: 'Brisbane',
    country: 'Australia',
    type: 'airport'
  },
  'PER': {
    code: 'PER',
    name: 'Perth Airport',
    city: 'Perth',
    country: 'Australia',
    type: 'airport'
  },
  'AKL': {
    code: 'AKL',
    name: 'Auckland Airport',
    city: 'Auckland',
    country: 'New Zealand',
    type: 'airport'
  },

  // Canada
  'YYZ': {
    code: 'YYZ',
    name: 'Toronto Pearson International Airport',
    city: 'Toronto',
    country: 'Canada',
    type: 'airport'
  },
  'YVR': {
    code: 'YVR',
    name: 'Vancouver International Airport',
    city: 'Vancouver',
    country: 'Canada',
    type: 'airport'
  },
  'YUL': {
    code: 'YUL',
    name: 'Montréal-Pierre Elliott Trudeau International Airport',
    city: 'Montreal',
    country: 'Canada',
    type: 'airport'
  },
  'YYC': {
    code: 'YYC',
    name: 'Calgary International Airport',
    city: 'Calgary',
    country: 'Canada',
    type: 'airport'
  },

  // Latin America
  'MEX': {
    code: 'MEX',
    name: 'Mexico City International Airport',
    city: 'Mexico City',
    country: 'Mexico',
    type: 'airport'
  },
  'GRU': {
    code: 'GRU',
    name: 'São Paulo-Guarulhos International Airport',
    city: 'São Paulo',
    country: 'Brazil',
    type: 'airport'
  },
  'GIG': {
    code: 'GIG',
    name: 'Rio de Janeiro-Galeão International Airport',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    type: 'airport'
  },
  'BOG': {
    code: 'BOG',
    name: 'El Dorado International Airport',
    city: 'Bogotá',
    country: 'Colombia',
    type: 'airport'
  },
  'LIM': {
    code: 'LIM',
    name: 'Jorge Chávez International Airport',
    city: 'Lima',
    country: 'Peru',
    type: 'airport'
  },
  'SCL': {
    code: 'SCL',
    name: 'Arturo Merino Benítez International Airport',
    city: 'Santiago',
    country: 'Chile',
    type: 'airport'
  },
  'EZE': {
    code: 'EZE',
    name: 'Ministro Pistarini International Airport',
    city: 'Buenos Aires',
    country: 'Argentina',
    type: 'airport'
  },
  'PTY': {
    code: 'PTY',
    name: 'Tocumen International Airport',
    city: 'Panama City',
    country: 'Panama',
    type: 'airport'
  },
};

/**
 * Search airports by query string
 * Searches across code, name, city, and country
 */
export function searchAirports(query: string, limit = 10): Airport[] {
  if (!query || query.length < 1) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: Airport[] = [];

  for (const airport of Object.values(AIRPORTS)) {
    const codeMatch = airport.code.toLowerCase().startsWith(normalizedQuery);
    const nameMatch = airport.name.toLowerCase().includes(normalizedQuery);
    const cityMatch = airport.city.toLowerCase().includes(normalizedQuery);
    const countryMatch = airport.country.toLowerCase().includes(normalizedQuery);

    if (codeMatch || nameMatch || cityMatch || countryMatch) {
      results.push(airport);
    }
  }

  // Sort: exact code matches first, then city codes, then alphabetically
  results.sort((a, b) => {
    const aExactMatch = a.code.toLowerCase() === normalizedQuery;
    const bExactMatch = b.code.toLowerCase() === normalizedQuery;

    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;

    const aIsCity = a.type === 'city';
    const bIsCity = b.type === 'city';

    if (aIsCity && !bIsCity) return -1;
    if (!aIsCity && bIsCity) return 1;

    return a.code.localeCompare(b.code);
  });

  return results.slice(0, limit);
}

/**
 * Get airport by code
 */
export function getAirport(code: string): Airport | null {
  return AIRPORTS[code.toUpperCase()] || null;
}

/**
 * Check if code is a city code (represents multiple airports)
 */
export function isCityCode(code: string): boolean {
  const airport = getAirport(code);
  return airport?.type === 'city';
}

/**
 * Get all airport codes for a city code
 * If given an individual airport, returns just that airport
 */
export function expandCityCode(code: string): string[] {
  const airport = getAirport(code);

  if (!airport) return [code];
  if (airport.type === 'city' && airport.airports) {
    return airport.airports;
  }

  return [code];
}

/**
 * Get all airport codes (useful for validation)
 */
export function getAllAirportCodes(): string[] {
  return Object.keys(AIRPORTS);
}

/**
 * Format airport for display
 */
export function formatAirportDisplay(airport: Airport): string {
  if (airport.type === 'city') {
    return `${airport.code} - ${airport.city} (All Airports)`;
  }
  return `${airport.code} - ${airport.name}`;
}
