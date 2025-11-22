import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlightSearchEngine } from '@/lib/api/flightEngine';
import { SearchParams } from '@/types';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const searchParams: SearchParams = {
      origin: body.origin,
      destination: body.destination,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      adults: body.adults || 1,
      children: body.children || 0,
      infants: body.infants || 0,
      cabinClass: body.cabinClass || 'economy',
      maxLayovers: body.maxLayovers,
      includeCreativeRouting: body.includeCreativeRouting || false,
    };

    const searchHash = crypto
      .createHash('md5')
      .update(JSON.stringify(searchParams))
      .digest('hex');

    const { data: cachedResult } = await supabase
      .from('flight_results_cache')
      .select('results, expires_at')
      .eq('search_hash', searchHash)
      .single();

    if (cachedResult && new Date(cachedResult.expires_at) > new Date()) {
      console.log('Returning cached results');
      return NextResponse.json({
        success: true,
        data: cachedResult.results,
        cached: true,
      });
    }

    const startTime = Date.now();
    const engine = new FlightSearchEngine();

    let results;
    if (searchParams.includeCreativeRouting) {
      results = await engine.compareWithCreativeRouting(searchParams);
    } else {
      const flights = await engine.searchAllAPIs(searchParams);
      results = {
        directFlights: flights,
        creativeRoutes: [],
      };
    }

    const searchDuration = Date.now() - startTime;

    const searchResult = {
      searchId: crypto.randomUUID(),
      params: searchParams,
      ...results,
      timestamp: new Date().toISOString(),
      searchDuration,
    };

    await supabase.from('flight_results_cache').upsert({
      search_hash: searchHash,
      origin: searchParams.origin,
      destination: searchParams.destination,
      departure_date: searchParams.departureDate,
      return_date: searchParams.returnDate,
      results: searchResult,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });

    await supabase.from('search_history').insert({
      user_id: user.id,
      search_params: searchParams,
      results_count: results.directFlights.length + results.creativeRoutes.length,
      cheapest_price: results.directFlights[0]?.price || null,
    });

    return NextResponse.json({
      success: true,
      data: searchResult,
      cached: false,
    });
  } catch (error) {
    console.error('Flight search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search flights',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: searchHistory, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: searchHistory,
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch search history',
      },
      { status: 500 }
    );
  }
}
