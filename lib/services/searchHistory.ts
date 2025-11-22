import { createClient } from '@/lib/supabase/server';
import { SearchParams } from '@/types';

export interface SearchHistoryEntry {
  id: string;
  user_id: string;
  search_params: SearchParams;
  results_count: number | null;
  cheapest_price: number | null;
  created_at: string;
}

export interface RecentSearch {
  origin: string;
  destination: string;
  count: number;
  last_searched: string;
}

/**
 * Save a search to user's history
 */
export async function saveSearchToHistory(
  params: SearchParams,
  resultsCount: number = 0,
  cheapestPrice: number | null = null
): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('search_history').insert({
      user_id: user.id,
      search_params: params,
      results_count: resultsCount,
      cheapest_price: cheapestPrice,
    });
  } catch (error) {
    console.error('Error saving search to history:', error);
  }
}

/**
 * Get user's search history
 */
export async function getSearchHistory(limit: number = 50): Promise<SearchHistoryEntry[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
}

/**
 * Get recent unique routes (for autocomplete)
 */
export async function getRecentRoutes(limit: number = 10): Promise<RecentSearch[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Get all searches and aggregate by route
    const { data, error } = await supabase
      .from('search_history')
      .select('search_params, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    if (!data) return [];

    // Aggregate by unique route
    const routeMap = new Map<string, RecentSearch>();

    for (const entry of data) {
      const params = entry.search_params as SearchParams;
      const routeKey = `${params.origin}-${params.destination}`;

      if (!routeMap.has(routeKey)) {
        routeMap.set(routeKey, {
          origin: params.origin,
          destination: params.destination,
          count: 1,
          last_searched: entry.created_at,
        });
      } else {
        const existing = routeMap.get(routeKey)!;
        existing.count++;
        // Keep the most recent search time
        if (new Date(entry.created_at) > new Date(existing.last_searched)) {
          existing.last_searched = entry.created_at;
        }
      }
    }

    // Convert to array and sort by recency
    return Array.from(routeMap.values())
      .sort((a, b) => new Date(b.last_searched).getTime() - new Date(a.last_searched).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent routes:', error);
    return [];
  }
}

/**
 * Get most searched routes
 */
export async function getPopularRoutes(limit: number = 5): Promise<RecentSearch[]> {
  try {
    const routes = await getRecentRoutes(50);

    // Sort by count instead of recency
    return routes
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching popular routes:', error);
    return [];
  }
}

/**
 * Clear user's search history
 */
export async function clearSearchHistory(): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from('search_history')
      .delete()
      .eq('user_id', user.id);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}

/**
 * Delete specific search from history
 */
export async function deleteSearchFromHistory(searchId: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from('search_history')
      .delete()
      .eq('id', searchId)
      .eq('user_id', user.id);
  } catch (error) {
    console.error('Error deleting search from history:', error);
  }
}
