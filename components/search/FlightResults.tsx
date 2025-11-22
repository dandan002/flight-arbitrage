'use client';

import { FlightRoute, CreativeRoutingOption } from '@/types';
import { format } from 'date-fns';
import { Plane, Clock, ExternalLink } from 'lucide-react';
import { getAirlineName } from '@/lib/data/airlines';

interface FlightResultsProps {
  directFlights: FlightRoute[];
  creativeRoutes?: CreativeRoutingOption[];
  savings?: {
    amount: number;
    percentage: number;
    description: string;
  };
}

export function FlightResults({
  directFlights,
  creativeRoutes = [],
  savings,
}: FlightResultsProps) {
  if (directFlights.length === 0 && creativeRoutes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No flights found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  const hasResults = directFlights.length > 0 || creativeRoutes.length > 0;

  // Merge all flights (direct + creative) into a single list and sort by price
  const allFlights: FlightRoute[] = [
    ...directFlights,
    ...creativeRoutes.flatMap(cr => cr.routes)
  ].sort((a, b) => a.price - b.price);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd');
  };

  const renderFlightCard = (flight: FlightRoute, index: number) => (
    <div
      key={flight.id}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div className="text-2xl font-bold text-gray-900">
              ${flight.price.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">{flight.currency}</div>
            {index === 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                BEST PRICE
              </span>
            )}
            {flight.isCreativeRouting && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                CREATIVE ROUTING
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(flight.totalDuration)}</span>
            <span className="ml-4">
              {flight.layovers === 0
                ? 'Direct'
                : `${flight.layovers} ${flight.layovers === 1 ? 'stop' : 'stops'}`}
            </span>
          </div>
        </div>

        <a
          href={flight.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-end gap-1"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Book Direct on Airline
            <ExternalLink className="w-4 h-4" />
          </div>
          <div className="text-xs text-gray-500">
            {getAirlineName(flight.segments[0].airline)} • Direct Booking
          </div>
        </a>
      </div>

      <div className="space-y-3">
        {flight.segments.map((segment, segIdx) => (
          <div key={segment.id} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Plane className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {segment.origin.code} → {segment.destination.code}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getAirlineName(segment.airline)} • {segment.flightNumber}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {formatTime(segment.departure)} - {formatTime(segment.arrival)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(segment.departure)}
                </div>
              </div>
            </div>

            {segIdx < flight.segments.length - 1 && (
              <div className="mt-2 ml-9 text-sm text-amber-600">
                Layover at {segment.destination.code}
              </div>
            )}
          </div>
        ))}
      </div>

      {flight.priceBreakdown && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">Price Breakdown:</div>
            {flight.priceBreakdown.segmentPrices.map((price, idx) => (
              <div key={idx} className="flex justify-between">
                <span>Segment {idx + 1}:</span>
                <span>${price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {hasResults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="text-blue-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">All Prices in USD • Direct Airline Booking</p>
              <p className="text-sm text-blue-700 mt-1">
                Prices shown are from airlines directly, not third-party sites. Click any booking button to go straight to the airline&apos;s website.
              </p>
            </div>
          </div>
        </div>
      )}

      {savings && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="text-green-800 font-semibold">
              💰 {savings.description}
            </div>
          </div>
          <div className="text-green-700 text-sm mt-1">
            Save ${savings.amount.toFixed(2)} ({savings.percentage.toFixed(1)}%)
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Best Available Flights (Sorted by Price)
        </h2>
        <div className="space-y-4">
          {allFlights.slice(0, 15).map((flight, idx) =>
            renderFlightCard(flight, idx)
          )}
        </div>
      </div>
    </div>
  );
}
