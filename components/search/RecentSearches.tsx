'use client';

import { useEffect, useState } from 'react';
import { Plane, TrendingUp, Clock } from 'lucide-react';
import { getAirport } from '@/lib/data/airports';
import type { RecentSearch } from '@/lib/services/searchHistory';

interface RecentSearchesProps {
  onSelectRoute: (origin: string, destination: string) => void;
}

export function RecentSearches({ onSelectRoute }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [popularSearches, setPopularSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    try {
      const [recentRes, popularRes] = await Promise.all([
        fetch('/api/search-history/recent'),
        fetch('/api/search-history/popular'),
      ]);

      if (recentRes.ok) {
        const recentData = await recentRes.json();
        setRecentSearches(recentData.data || []);
      }

      if (popularRes.ok) {
        const popularData = await popularRes.json();
        setPopularSearches(popularData.data || []);
      }
    } catch (error) {
      console.error('Error loading searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAirportName = (code: string): string => {
    const airport = getAirport(code);
    return airport ? `${code} (${airport.city})` : code;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (recentSearches.length === 0 && popularSearches.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Quick Search
      </h3>

      {recentSearches.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Searches
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentSearches.map((search, index) => (
              <button
                key={`recent-${index}`}
                onClick={() => onSelectRoute(search.origin, search.destination)}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <Plane className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <span className="truncate">{formatAirportName(search.origin)}</span>
                    <span className="text-gray-400">→</span>
                    <span className="truncate">{formatAirportName(search.destination)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(search.last_searched)}
                    </span>
                    {search.count > 1 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {search.count}x
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {popularSearches.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popular Routes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularSearches.map((search, index) => (
              <button
                key={`popular-${index}`}
                onClick={() => onSelectRoute(search.origin, search.destination)}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
              >
                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <span className="truncate">{formatAirportName(search.origin)}</span>
                    <span className="text-gray-400">→</span>
                    <span className="truncate">{formatAirportName(search.destination)}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
                      {search.count} search{search.count !== 1 ? 'es' : ''}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
