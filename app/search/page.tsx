
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { SearchForm } from '@/components/search/SearchForm';
import { FlightResults } from '@/components/search/FlightResults';
import { RecentSearches } from '@/components/search/RecentSearches';
import { SearchParams, FlightRoute, CreativeRoutingOption } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    directFlights: FlightRoute[];
    creativeRoutes: CreativeRoutingOption[];
    savings?: {
      amount: number;
      percentage: number;
      description: string;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prefillParams, setPrefillParams] = useState<SearchParams | null>(null);
  const [showRecentSearches, setShowRecentSearches] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Check for prefilled search from history
  useEffect(() => {
    const prefillData = sessionStorage.getItem('prefillSearch');
    if (prefillData) {
      try {
        const params = JSON.parse(prefillData);
        setPrefillParams(params);
        sessionStorage.removeItem('prefillSearch');
      } catch (error) {
        console.error('Error parsing prefill data:', error);
      }
    }
  }, []);

  const handleSelectRoute = (origin: string, destination: string) => {
    setPrefillParams({
      origin,
      destination,
      departureDate: '',
      returnDate: '',
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'economy',
      maxLayovers: 2,
      includeCreativeRouting: true,
    });
    setShowRecentSearches(false);
  };

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setShowRecentSearches(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search flights');
      }

      if (data.success && data.data) {
        setResults({
          directFlights: data.data.directFlights || [],
          creativeRoutes: data.data.creativeRoutes || [],
          savings: data.data.savings,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/gremlin-logo.png" alt="Gremlin Flights Logo" width={48} height={48} className="w-12 h-12" />
              <h1 className="text-2xl font-bold text-gray-900">
                Gremlin Flights
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/history"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Clock className="w-4 h-4" />
                History
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Find the Cheapest Flights
          </h2>
          <p className="text-gray-600">
            Search for direct flights and discover creative routing options to save money
          </p>
        </div>

        {showRecentSearches && !results && (
          <div className="mb-6">
            <RecentSearches onSelectRoute={handleSelectRoute} />
          </div>
        )}

        <SearchForm
          onSearch={handleSearch}
          loading={loading}
          initialValues={prefillParams || undefined}
        />

        {loading && (
          <div className="mt-8 text-center py-12 bg-white rounded-lg shadow-md">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching for the best deals...</p>
            <p className="mt-2 text-sm text-gray-500">
              This may take a moment as we search multiple airlines and routes
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {results && !loading && (
          <div className="mt-8">
            <FlightResults
              directFlights={results.directFlights}
              creativeRoutes={results.creativeRoutes}
              savings={results.savings}
            />
          </div>
        )}
      </main>

      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              Gremlin Flights - Find the cheapest flights with creative routing
            </p>
            <p className="text-xs text-gray-500">
              Powered by Amadeus API | Book directly with airlines
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
