import Link from 'next/link';
import Image from 'next/image';
import { Plane, DollarSign, Search, TrendingDown } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/gremlin-logo.png" alt="Gremlin Flights Logo" width={48} height={48} className="w-12 h-12" />
              <h1 className="text-2xl font-bold text-gray-900">
                Gremlin Flights
              </h1>
            </div>
            <div className="space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Find the Cheapest Flights with Creative Routing
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gremlin Flights searches multiple airlines and discovers creative routing options
            to help you save money on air travel. Book directly with airlines.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            Start Searching Flights
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Amadeus Flight Search
            </h3>
            <p className="text-gray-600">
              Powered by Amadeus API for comprehensive, real-time flight data from airlines worldwide
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Plane className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Creative Routing
            </h3>
            <p className="text-gray-600">
              Discover cheaper routes by booking separate flights through strategic hub cities
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Best Prices
            </h3>
            <p className="text-gray-600">
              Compare prices and save money by finding arbitrage opportunities in flight pricing
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Direct Booking
            </h3>
            <p className="text-gray-600">
              All results include direct links to airline websites for secure booking
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            How Creative Routing Works
          </h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Sometimes booking separate flights through strategic hub cities can be significantly cheaper
              than direct flights or standard connections. Our engine automatically searches for these opportunities.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-gray-900 mb-2">Example:</p>
              <p>
                Flying from Shanghai (PVG) to Tokyo (HND)? Instead of booking a direct flight,
                our engine might find that booking PVG → ICN (Seoul) and ICN → HND separately
                saves you 30% or more.
              </p>
            </div>
            <p>
              All booking links go directly to airline websites, ensuring you get official prices
              and customer service from the airlines themselves.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              Gremlin Flights - Find the cheapest flights with creative routing
            </p>
            <p className="text-xs text-gray-500">
              Powered by Amadeus API | All bookings made directly with airlines
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
