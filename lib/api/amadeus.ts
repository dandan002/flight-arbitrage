import axios from 'axios';
import { FlightRoute, FlightSegment, SearchParams, Airport } from '@/types';
import { generateBookingUrl, getAirlineName } from '@/lib/data/airlines';

interface AmadeusTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

export class AmadeusAPI {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://test.api.amadeus.com';

  constructor() {
    this.apiKey = process.env.AMADEUS_API_KEY || '';
    this.apiSecret = process.env.AMADEUS_API_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
      return tokenCache.token;
    }

    try {
      const response = await axios.post<AmadeusTokenResponse>(
        `${this.baseUrl}/v1/security/oauth2/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      tokenCache = {
        token: response.data.access_token,
        expiresAt: Date.now() + (response.data.expires_in - 60) * 1000,
      };

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting Amadeus token:', error);
      throw new Error('Failed to authenticate with Amadeus API');
    }
  }

  async searchFlights(params: SearchParams): Promise<FlightRoute[]> {
    try {
      const token = await this.getAccessToken();

      const searchParams: any = {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        children: params.children?.toString() || '0',
        infants: params.infants?.toString() || '0',
        travelClass: params.cabinClass?.toUpperCase() || 'ECONOMY',
        nonStop: params.maxLayovers === 0 ? 'true' : 'false',
        currencyCode: 'USD', // Force USD pricing
        max: '50',
      };

      // Add return date if provided
      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }

      const response = await axios.get(`${this.baseUrl}/v2/shopping/flight-offers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      });

      return this.transformAmadeusResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Amadeus API error:', error.response?.data || error.message);
      }
      return [];
    }
  }

  private transformAmadeusResponse(data: any): FlightRoute[] {
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    // Filter and transform results
    return data.data
      .filter((offer: any) => {
        // Filter out third-party bookings - only include airline direct bookings
        // Amadeus returns offers with validatingAirlineCodes
        const validatingAirlines = offer.validatingAirlineCodes || [];
        const firstSegmentCarrier = offer.itineraries[0]?.segments[0]?.carrierCode;

        // Only include if the validating airline matches the operating airline
        // This ensures we're getting direct airline prices, not OTA prices
        return validatingAirlines.includes(firstSegmentCarrier);
      })
      .map((offer: any) => {
        const itinerary = offer.itineraries[0];
        const segments: FlightSegment[] = itinerary.segments.map((seg: any, idx: number) => ({
          id: `${offer.id}-${idx}`,
          origin: {
            code: seg.departure.iataCode,
            name: seg.departure.terminal || '',
            city: seg.departure.iataCode,
            country: '',
          } as Airport,
          destination: {
            code: seg.arrival.iataCode,
            name: seg.arrival.terminal || '',
            city: seg.arrival.iataCode,
            country: '',
          } as Airport,
          departure: seg.departure.at,
          arrival: seg.arrival.at,
          duration: this.parseDuration(seg.duration),
          airline: seg.carrierCode,
          flightNumber: `${seg.carrierCode}${seg.number}`,
          aircraft: seg.aircraft?.code,
          bookingClass: seg.bookingClass,
        }));

        // Always use USD
        const priceInUSD = parseFloat(offer.price.total);

        // Get the operating airline for the flight
        const operatingAirline = segments[0].airline;

        return {
          id: offer.id,
          segments,
          totalDuration: this.parseDuration(itinerary.duration),
          layovers: segments.length - 1,
          price: priceInUSD,
          currency: 'USD', // Always USD
          deepLink: this.generateAirlineDirectLink(segments, operatingAirline),
          bookingUrl: this.generateAirlineDirectLink(segments, operatingAirline),
          routeType: segments.length === 1 ? 'direct' : 'layover',
          isCreativeRouting: false,
        } as FlightRoute;
      });
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return 0;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;

    return hours * 60 + minutes;
  }

  private generateAirlineDirectLink(segments: FlightSegment[], airlineCode: string): string {
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    const origin = firstSegment.origin.code;
    const destination = lastSegment.destination.code;
    const departureDate = firstSegment.departure.split('T')[0];

    return generateBookingUrl(airlineCode, origin, destination, departureDate);
  }

  async getAirportInfo(iataCode: string): Promise<Airport | null> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/v1/reference-data/locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            keyword: iataCode,
            subType: 'AIRPORT',
          },
        }
      );

      if (response.data.data && response.data.data.length > 0) {
        const airport = response.data.data[0];
        return {
          code: airport.iataCode,
          name: airport.name,
          city: airport.address?.cityName || '',
          country: airport.address?.countryName || '',
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching airport info:', error);
      return null;
    }
  }
}
