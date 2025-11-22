import { NextRequest, NextResponse } from 'next/server';
import { getSearchHistory, clearSearchHistory, deleteSearchFromHistory } from '@/lib/services/searchHistory';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    const history = await getSearchHistory(limit);

    return NextResponse.json({
      success: true,
      data: history,
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

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchId = searchParams.get('id');

    if (searchId) {
      // Delete specific search
      await deleteSearchFromHistory(searchId);
    } else {
      // Clear all history
      await clearSearchHistory();
    }

    return NextResponse.json({
      success: true,
      message: searchId ? 'Search deleted' : 'History cleared',
    });
  } catch (error) {
    console.error('Error deleting search history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete search history',
      },
      { status: 500 }
    );
  }
}
