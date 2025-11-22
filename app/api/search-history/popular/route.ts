import { NextResponse } from 'next/server';
import { getPopularRoutes } from '@/lib/services/searchHistory';

export async function GET() {
  try {
    const routes = await getPopularRoutes(5);

    return NextResponse.json({
      success: true,
      data: routes,
    });
  } catch (error) {
    console.error('Error fetching popular routes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch popular routes',
      },
      { status: 500 }
    );
  }
}
