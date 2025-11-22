export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSegment {
  id: string;
  origin: Airport;
  destination: Airport;
  departure: string;
  arrival: string;
  duration: number;
  airline: string;
  flightNumber: string;
  aircraft?: string;
  bookingClass?: string;
}

export interface FlightRoute {
  id: string;
  segments: FlightSegment[];
  totalDuration: number;
  layovers: number;
  price: number;
  currency: string;
  deepLink: string;
  bookingUrl: string;
  isCreativeRouting?: boolean;
  routeType: 'direct' | 'layover' | 'multi-city';
  priceBreakdown?: {
    segmentPrices: number[];
    totalPrice: number;
  };
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  maxLayovers?: number;
  includeCreativeRouting?: boolean;
}

export interface SearchResult {
  searchId: string;
  params: SearchParams;
  routes: FlightRoute[];
  timestamp: string;
  searchDuration: number;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  params: SearchParams;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AmadeusToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface CreativeRoutingOption {
  routes: FlightRoute[];
  totalPrice: number;
  description: string;
  savings?: number;
}
