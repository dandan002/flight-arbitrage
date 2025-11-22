/**
 * Comprehensive airline database with IATA codes, names, and verified booking URLs
 * Last updated: 2025-11-22
 */

export interface AirlineData {
  code: string;
  name: string;
  website: string;
  bookingUrlTemplate: string;
}

export const AIRLINES: Record<string, AirlineData> = {
  // US Airlines
  'AA': {
    code: 'AA',
    name: 'American Airlines',
    website: 'https://www.aa.com',
    bookingUrlTemplate: 'https://www.aa.com/booking/find-flights?locale=en_US&from={origin}&to={destination}&departDate={date}'
  },
  'UA': {
    code: 'UA',
    name: 'United Airlines',
    website: 'https://www.united.com',
    bookingUrlTemplate: 'https://www.united.com/en/us/fsr/choose-flights?f={origin}&t={destination}&d={date}&tt=1'
  },
  'DL': {
    code: 'DL',
    name: 'Delta Air Lines',
    website: 'https://www.delta.com',
    bookingUrlTemplate: 'https://www.delta.com/flight-search/book-a-flight?from={origin}&to={destination}&departureDate={date}'
  },
  'WN': {
    code: 'WN',
    name: 'Southwest Airlines',
    website: 'https://www.southwest.com',
    bookingUrlTemplate: 'https://www.southwest.com/air/booking/search.html?originationAirportCode={origin}&destinationAirportCode={destination}&departureDate={date}'
  },
  'AS': {
    code: 'AS',
    name: 'Alaska Airlines',
    website: 'https://www.alaskaair.com',
    bookingUrlTemplate: 'https://www.alaskaair.com/booking/flights?from={origin}&to={destination}&departureDate={date}'
  },
  'B6': {
    code: 'B6',
    name: 'JetBlue Airways',
    website: 'https://www.jetblue.com',
    bookingUrlTemplate: 'https://www.jetblue.com/booking/flights?from={origin}&to={destination}&depart={date}'
  },
  'NK': {
    code: 'NK',
    name: 'Spirit Airlines',
    website: 'https://www.spirit.com',
    bookingUrlTemplate: 'https://www.spirit.com/book/flights?departure={origin}&destination={destination}&departureDate={date}'
  },
  'F9': {
    code: 'F9',
    name: 'Frontier Airlines',
    website: 'https://www.flyfrontier.com',
    bookingUrlTemplate: 'https://www.flyfrontier.com/travel/flights/?departureStation={origin}&arrivalStation={destination}&departureDate={date}'
  },

  // European Airlines
  'BA': {
    code: 'BA',
    name: 'British Airways',
    website: 'https://www.britishairways.com',
    bookingUrlTemplate: 'https://www.britishairways.com/travel/book/public/en_us?eId=106019&from={origin}&to={destination}&depDate={date}'
  },
  'LH': {
    code: 'LH',
    name: 'Lufthansa',
    website: 'https://www.lufthansa.com',
    bookingUrlTemplate: 'https://www.lufthansa.com/us/en/flight-search?origin={origin}&destination={destination}&outbound-date={date}'
  },
  'AF': {
    code: 'AF',
    name: 'Air France',
    website: 'https://www.airfrance.com',
    bookingUrlTemplate: 'https://www.airfrance.com/search/offers?origin={origin}&destination={destination}&departureDate={date}'
  },
  'KL': {
    code: 'KL',
    name: 'KLM Royal Dutch Airlines',
    website: 'https://www.klm.com',
    bookingUrlTemplate: 'https://www.klm.com/search/offers?origin={origin}&destination={destination}&departureDate={date}'
  },
  'IB': {
    code: 'IB',
    name: 'Iberia',
    website: 'https://www.iberia.com',
    bookingUrlTemplate: 'https://www.iberia.com/us/flights/{origin}-{destination}/?dates={date}'
  },
  'AY': {
    code: 'AY',
    name: 'Finnair',
    website: 'https://www.finnair.com',
    bookingUrlTemplate: 'https://www.finnair.com/en/flight-search?origin={origin}&destination={destination}&departureDate={date}'
  },
  'SK': {
    code: 'SK',
    name: 'SAS Scandinavian Airlines',
    website: 'https://www.flysas.com',
    bookingUrlTemplate: 'https://www.flysas.com/en/book-flights/?search=OW_{origin}-{destination}-{date}'
  },
  'TP': {
    code: 'TP',
    name: 'TAP Air Portugal',
    website: 'https://www.flytap.com',
    bookingUrlTemplate: 'https://www.flytap.com/en-us/book-a-trip?origin={origin}&destination={destination}&departure={date}'
  },
  'LX': {
    code: 'LX',
    name: 'Swiss International Air Lines',
    website: 'https://www.swiss.com',
    bookingUrlTemplate: 'https://www.swiss.com/us/en/book/flight-selection?origin={origin}&destination={destination}&outboundDate={date}'
  },
  'OS': {
    code: 'OS',
    name: 'Austrian Airlines',
    website: 'https://www.austrian.com',
    bookingUrlTemplate: 'https://www.austrian.com/us/en/book/flight-selection?origin={origin}&destination={destination}&outboundDate={date}'
  },
  'FR': {
    code: 'FR',
    name: 'Ryanair',
    website: 'https://www.ryanair.com',
    bookingUrlTemplate: 'https://www.ryanair.com/us/en/trip/flights/select?adults=1&dateOut={date}&originIata={origin}&destinationIata={destination}'
  },
  'U2': {
    code: 'U2',
    name: 'easyJet',
    website: 'https://www.easyjet.com',
    bookingUrlTemplate: 'https://www.easyjet.com/en/booking?origin={origin}&destination={destination}&departureDate={date}'
  },

  // Asian Airlines
  'NH': {
    code: 'NH',
    name: 'All Nippon Airways (ANA)',
    website: 'https://www.ana.co.jp',
    bookingUrlTemplate: 'https://www.ana.co.jp/en/us/book-flights/?dep={origin}&arr={destination}&depDate={date}'
  },
  'JL': {
    code: 'JL',
    name: 'Japan Airlines',
    website: 'https://www.jal.co.jp',
    bookingUrlTemplate: 'https://www.jal.co.jp/en/flights/reservation/?dep={origin}&arr={destination}&depdate={date}'
  },
  'SQ': {
    code: 'SQ',
    name: 'Singapore Airlines',
    website: 'https://www.singaporeair.com',
    bookingUrlTemplate: 'https://www.singaporeair.com/en_UK/plan-and-book/book-flight/?from={origin}&to={destination}&dep={date}'
  },
  'CX': {
    code: 'CX',
    name: 'Cathay Pacific',
    website: 'https://www.cathaypacific.com',
    bookingUrlTemplate: 'https://www.cathaypacific.com/cx/en_US/book-a-trip/flights.html?s={origin}&d={destination}&dd={date}'
  },
  'TG': {
    code: 'TG',
    name: 'Thai Airways',
    website: 'https://www.thaiairways.com',
    bookingUrlTemplate: 'https://www.thaiairways.com/en_US/book_online/choose_flights.page?from={origin}&to={destination}&depart={date}'
  },
  'KE': {
    code: 'KE',
    name: 'Korean Air',
    website: 'https://www.koreanair.com',
    bookingUrlTemplate: 'https://www.koreanair.com/us/en/booking/flight-search?origin={origin}&destination={destination}&departure={date}'
  },
  'OZ': {
    code: 'OZ',
    name: 'Asiana Airlines',
    website: 'https://flyasiana.com',
    bookingUrlTemplate: 'https://flyasiana.com/I/US/en/booking/booking-main.do?dep={origin}&arr={destination}&depDate={date}'
  },
  'CA': {
    code: 'CA',
    name: 'Air China',
    website: 'https://www.airchina.com',
    bookingUrlTemplate: 'https://www.airchina.com/US/GB/book-a-flight?from={origin}&to={destination}&date={date}'
  },
  'MU': {
    code: 'MU',
    name: 'China Eastern Airlines',
    website: 'https://us.ceair.com',
    bookingUrlTemplate: 'https://us.ceair.com/booking/search?departCity={origin}&arriveCity={destination}&departDate={date}'
  },
  'CZ': {
    code: 'CZ',
    name: 'China Southern Airlines',
    website: 'https://www.csair.com',
    bookingUrlTemplate: 'https://www.csair.com/us/en/tourguide/booking_ticket/?dep={origin}&arr={destination}&date={date}'
  },

  // Middle Eastern Airlines
  'EK': {
    code: 'EK',
    name: 'Emirates',
    website: 'https://www.emirates.com',
    bookingUrlTemplate: 'https://www.emirates.com/us/english/book-a-flight/search?from={origin}&to={destination}&dd={date}'
  },
  'QR': {
    code: 'QR',
    name: 'Qatar Airways',
    website: 'https://www.qatarairways.com',
    bookingUrlTemplate: 'https://www.qatarairways.com/en-us/booking.html?origin={origin}&destination={destination}&departure={date}'
  },
  'EY': {
    code: 'EY',
    name: 'Etihad Airways',
    website: 'https://www.etihad.com',
    bookingUrlTemplate: 'https://www.etihad.com/en-us/flights-from-{origin}-to-{destination}?adults=1&departureDate={date}'
  },

  // Latin American Airlines
  'LA': {
    code: 'LA',
    name: 'LATAM Airlines',
    website: 'https://www.latam.com',
    bookingUrlTemplate: 'https://www.latam.com/en_us/flights/flight-search?origin={origin}&destination={destination}&outbound={date}'
  },
  'CM': {
    code: 'CM',
    name: 'Copa Airlines',
    website: 'https://www.copaair.com',
    bookingUrlTemplate: 'https://www.copaair.com/en/web/us/booking-path?from={origin}&to={destination}&date={date}'
  },
  'AM': {
    code: 'AM',
    name: 'Aeroméxico',
    website: 'https://www.aeromexico.com',
    bookingUrlTemplate: 'https://www.aeromexico.com/en-us/book-now?dep={origin}&arr={destination}&depDate={date}'
  },
  'AV': {
    code: 'AV',
    name: 'Avianca',
    website: 'https://www.avianca.com',
    bookingUrlTemplate: 'https://www.avianca.com/us/en/booking/?origin={origin}&destination={destination}&departure={date}'
  },

  // Other Major Airlines
  'AC': {
    code: 'AC',
    name: 'Air Canada',
    website: 'https://www.aircanada.com',
    bookingUrlTemplate: 'https://www.aircanada.com/en/flights/{origin}-{destination}?date={date}'
  },
  'NZ': {
    code: 'NZ',
    name: 'Air New Zealand',
    website: 'https://www.airnewzealand.com',
    bookingUrlTemplate: 'https://www.airnewzealand.com/book-a-flight?from={origin}&to={destination}&departure={date}'
  },
  'QF': {
    code: 'QF',
    name: 'Qantas',
    website: 'https://www.qantas.com',
    bookingUrlTemplate: 'https://www.qantas.com/au/en/booking/flights/vacations/search.html?origin={origin}&destination={destination}&departureDate={date}'
  },
  'VA': {
    code: 'VA',
    name: 'Virgin Australia',
    website: 'https://www.virginaustralia.com',
    bookingUrlTemplate: 'https://www.virginaustralia.com/au/en/book/flights/?origin={origin}&destination={destination}&departureDate={date}'
  },
  'VS': {
    code: 'VS',
    name: 'Virgin Atlantic',
    website: 'https://www.virginatlantic.com',
    bookingUrlTemplate: 'https://www.virginatlantic.com/book/flights?from={origin}&to={destination}&date={date}'
  },
  'TK': {
    code: 'TK',
    name: 'Turkish Airlines',
    website: 'https://www.turkishairlines.com',
    bookingUrlTemplate: 'https://www.turkishairlines.com/en-us/flights/booking/?originCode={origin}&destinationCode={destination}&departureDate={date}'
  },
  'AI': {
    code: 'AI',
    name: 'Air India',
    website: 'https://www.airindia.com',
    bookingUrlTemplate: 'https://www.airindia.com/us/en/booking/flight-booking.html?from={origin}&to={destination}&date={date}'
  },
  'SA': {
    code: 'SA',
    name: 'South African Airways',
    website: 'https://www.flysaa.com',
    bookingUrlTemplate: 'https://www.flysaa.com/book/flights?from={origin}&to={destination}&date={date}'
  },
  'ET': {
    code: 'ET',
    name: 'Ethiopian Airlines',
    website: 'https://www.ethiopianairlines.com',
    bookingUrlTemplate: 'https://www.ethiopianairlines.com/us/booking/flight-search?origin={origin}&destination={destination}&departure={date}'
  }
};

/**
 * Get airline information by IATA code
 */
export function getAirlineInfo(code: string): AirlineData | null {
  return AIRLINES[code] || null;
}

/**
 * Get airline name by IATA code
 */
export function getAirlineName(code: string): string {
  return AIRLINES[code]?.name || code;
}

/**
 * Generate direct booking URL for an airline
 */
export function generateBookingUrl(
  airlineCode: string,
  origin: string,
  destination: string,
  date: string
): string {
  const airline = AIRLINES[airlineCode];

  if (airline) {
    return airline.bookingUrlTemplate
      .replace('{origin}', origin)
      .replace('{destination}', destination)
      .replace('{date}', date);
  }

  // Fallback for unknown airlines
  return `https://www.google.com/flights?hl=en#flt=${origin}.${destination}.${date}`;
}

/**
 * Get all supported airline codes
 */
export function getAllAirlineCodes(): string[] {
  return Object.keys(AIRLINES);
}
