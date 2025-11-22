'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Trash2, DollarSign, Plane, Calendar, Users } from 'lucide-react';
import type { SearchHistoryEntry } from '@/lib/services/searchHistory';
import { getAirport } from '@/lib/data/airports';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/search-history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all search history?')) return;

    try {
      const res = await fetch('/api/search-history', {
        method: 'DELETE',
      });

      if (res.ok) {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      const res = await fetch(`/api/search-history?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  const handleSearchAgain = (entry: SearchHistoryEntry) => {
    // Store the search params and navigate to search page
    sessionStorage.setItem('prefillSearch', JSON.stringify(entry.search_params));
    router.push('/search');
  };

  const formatAirportName = (code: string): string => {
    const airport = getAirport(code);
    return airport ? `${code} (${airport.city})` : code;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                Search History
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage your past flight searches
              </p>
            </div>
            {history.length > 0 && (
              <Button
                onClick={handleClearHistory}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2 hover:bg-red-100 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Search History Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start searching for flights to see your history here
            </p>
            <Button onClick={() => router.push('/search')} variant="primary">
              Search Flights
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => {
              const params = entry.search_params;
              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Route */}
                      <div className="flex items-center gap-3 mb-3">
                        <Plane className="w-5 h-5 text-blue-600" />
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatAirportName(params.origin)}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-xl font-bold text-gray-900">
                            {formatAirportName(params.destination)}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{params.departureDate}</span>
                        </div>
                        {params.returnDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Return: {params.returnDate}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{params.adults} adult{params.adults > 1 ? 's' : ''}</span>
                        </div>
                        {entry.cheapest_price && (
                          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                            <DollarSign className="w-4 h-4" />
                            <span>${entry.cheapest_price.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatDate(entry.created_at)}</span>
                        {entry.results_count !== null && (
                          <span>• {entry.results_count} result{entry.results_count !== 1 ? 's' : ''}</span>
                        )}
                        <span>• {params.cabinClass}</span>
                        {params.includeCreativeRouting && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            Creative Routing
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleSearchAgain(entry)}
                        variant="primary"
                        size="sm"
                      >
                        Search Again
                      </Button>
                      <button
                        onClick={() => handleDeleteSearch(entry.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete this search"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
