import { AmadeusAPI } from './amadeus';
import { FlightRoute, SearchParams, CreativeRoutingOption } from '@/types';
import { expandCityCode } from '@/lib/data/airports';

export class FlightSearchEngine {
  private amadeusAPI: AmadeusAPI;

  constructor() {
    this.amadeusAPI = new AmadeusAPI();
  }

  async searchAllAPIs(params: SearchParams): Promise<FlightRoute[]> {
    try {
      // Handle city codes by expanding them to all airports
      const origins = expandCityCode(params.origin);
      const destinations = expandCityCode(params.destination);

      // If either is a city code, search all combinations
      if (origins.length > 1 || destinations.length > 1) {
        const allFlights: FlightRoute[] = [];

        for (const origin of origins) {
          for (const destination of destinations) {
            const cityParams = { ...params, origin, destination };
            const flights = await this.amadeusAPI.searchFlights(cityParams);
            allFlights.push(...flights);
          }
        }

        return this.deduplicateAndSort(allFlights);
      }

      // Single airport to airport search
      const flights = await this.amadeusAPI.searchFlights(params);
      return this.deduplicateAndSort(flights);
    } catch (error) {
      console.error('Error searching flights:', error);
      return [];
    }
  }

  async searchWithCreativeRouting(params: SearchParams): Promise<{
    direct: FlightRoute[];
    creative: CreativeRoutingOption[];
  }> {
    const [directFlights, creativeOptions] = await Promise.all([
      this.searchAllAPIs(params),
      this.findCreativeRoutes(params),
    ]);

    return {
      direct: directFlights,
      creative: creativeOptions,
    };
  }

  private async findCreativeRoutes(params: SearchParams): Promise<CreativeRoutingOption[]> {
    const majorHubs = this.getRelevantHubs(params.origin, params.destination);
    const creativeOptions: CreativeRoutingOption[] = [];

    // Search through top 5 relevant hubs
    for (const hub of majorHubs.slice(0, 5)) {
      try {
        // Search for leg 1: origin -> hub
        const leg1Params = {
          ...params,
          destination: hub,
          returnDate: undefined, // One-way
        };

        // Search for leg 2: hub -> destination
        const leg2Params = {
          ...params,
          origin: hub,
          returnDate: undefined, // One-way
        };

        const [leg1Results, leg2Results] = await Promise.all([
          this.amadeusAPI.searchFlights(leg1Params),
          this.amadeusAPI.searchFlights(leg2Params),
        ]);

        if (leg1Results.length > 0 && leg2Results.length > 0) {
          // Get cheapest option for each leg
          const leg1 = leg1Results[0];
          const leg2 = leg2Results[0];

          const totalPrice = leg1.price + leg2.price;
          const currency = leg1.currency;

          // Create combined route
          const combinedRoute: FlightRoute = {
            id: `creative-${leg1.id}-${leg2.id}`,
            segments: [...leg1.segments, ...leg2.segments],
            totalDuration: leg1.totalDuration + leg2.totalDuration,
            layovers: leg1.layovers + leg2.layovers + 1, // +1 for hub layover
            price: totalPrice,
            currency,
            deepLink: leg1.deepLink,
            bookingUrl: leg1.bookingUrl,
            isCreativeRouting: true,
            routeType: 'multi-city',
            priceBreakdown: {
              segmentPrices: [leg1.price, leg2.price],
              totalPrice,
            },
          };

          creativeOptions.push({
            routes: [combinedRoute],
            totalPrice,
            description: `Book separate tickets via ${hub}`,
          });
        }
      } catch (error) {
        console.error(`Error searching via hub ${hub}:`, error);
        continue;
      }
    }

    return creativeOptions.sort((a, b) => a.totalPrice - b.totalPrice);
  }

  private getRelevantHubs(origin: string, destination: string): string[] {
    const asiaHubs = ['ICN', 'HND', 'NRT', 'HKG', 'SIN', 'BKK', 'TPE', 'KUL'];
    const europeHubs = ['AMS', 'CDG', 'FRA', 'LHR', 'IST', 'MAD', 'BCN', 'MUC', 'ZRH'];
    const middleEastHubs = ['DXB', 'DOH', 'AUH', 'CAI'];
    const northAmericaHubs = ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'SFO', 'SEA', 'YVR'];
    const pacificHubs = ['SYD', 'MEL', 'AKL'];

    const originRegion = this.getRegion(origin);
    const destRegion = this.getRegion(destination);

    let relevantHubs: string[] = [];

    if (originRegion === 'asia' || destRegion === 'asia') {
      relevantHubs.push(...asiaHubs);
    }
    if (originRegion === 'europe' || destRegion === 'europe') {
      relevantHubs.push(...europeHubs);
    }
    if (originRegion === 'middle-east' || destRegion === 'middle-east') {
      relevantHubs.push(...middleEastHubs);
    }
    if (originRegion === 'north-america' || destRegion === 'north-america') {
      relevantHubs.push(...northAmericaHubs);
    }
    if (originRegion === 'pacific' || destRegion === 'pacific') {
      relevantHubs.push(...pacificHubs);
    }

    if (relevantHubs.length === 0) {
      relevantHubs = [...asiaHubs, ...europeHubs, ...middleEastHubs];
    }

    return [...new Set(relevantHubs)];
  }

  private getRegion(airportCode: string): string {
    const asiaAirports = ['PVG', 'PEK', 'ICN', 'HND', 'NRT', 'HKG', 'SIN', 'BKK', 'TPE', 'KUL', 'MNL', 'CGK', 'DEL', 'BOM'];
    const europeAirports = ['LHR', 'CDG', 'AMS', 'FRA', 'MAD', 'BCN', 'FCO', 'MUC', 'IST', 'ZRH', 'VIE', 'CPH', 'ARN'];
    const middleEastAirports = ['DXB', 'DOH', 'AUH', 'CAI', 'TLV', 'AMM'];
    const northAmericaAirports = ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'SFO', 'MIA', 'SEA', 'YVR', 'YYZ', 'MEX'];
    const pacificAirports = ['SYD', 'MEL', 'AKL', 'BNE', 'PER'];

    if (asiaAirports.includes(airportCode)) return 'asia';
    if (europeAirports.includes(airportCode)) return 'europe';
    if (middleEastAirports.includes(airportCode)) return 'middle-east';
    if (northAmericaAirports.includes(airportCode)) return 'north-america';
    if (pacificAirports.includes(airportCode)) return 'pacific';

    return 'unknown';
  }

  private deduplicateAndSort(flights: FlightRoute[]): FlightRoute[] {
    const uniqueFlights = new Map<string, FlightRoute>();

    flights.forEach((flight) => {
      const key = `${flight.segments.map(s => `${s.origin.code}-${s.destination.code}-${s.departure}`).join('|')}`;

      if (!uniqueFlights.has(key) || uniqueFlights.get(key)!.price > flight.price) {
        uniqueFlights.set(key, flight);
      }
    });

    return Array.from(uniqueFlights.values()).sort((a, b) => a.price - b.price);
  }

  async compareWithCreativeRouting(params: SearchParams): Promise<{
    directFlights: FlightRoute[];
    creativeRoutes: CreativeRoutingOption[];
    savings?: {
      amount: number;
      percentage: number;
      description: string;
    };
  }> {
    const { direct, creative } = await this.searchWithCreativeRouting(params);

    const cheapestDirect = direct[0];
    const cheapestCreative = creative[0];

    let savings;
    if (cheapestDirect && cheapestCreative && cheapestCreative.totalPrice < cheapestDirect.price) {
      const amount = cheapestDirect.price - cheapestCreative.totalPrice;
      const percentage = (amount / cheapestDirect.price) * 100;

      savings = {
        amount,
        percentage,
        description: `Save ${percentage.toFixed(0)}% by ${cheapestCreative.description}`,
      };
    }

    return {
      directFlights: direct,
      creativeRoutes: creative,
      savings,
    };
  }
}
