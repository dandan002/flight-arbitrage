'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AirportAutocomplete } from '@/components/ui/airport-autocomplete';
import { SearchParams } from '@/types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  initialValues?: Partial<SearchParams>;
}

export function SearchForm({ onSearch, loading = false, initialValues }: SearchFormProps) {
  const [formData, setFormData] = useState<SearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy',
    maxLayovers: 2,
    includeCreativeRouting: true,
    ...initialValues,
  });

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AirportAutocomplete
          value={formData.origin}
          onChange={(value) => setFormData(prev => ({ ...prev, origin: value }))}
          label="From"
          placeholder="JFK, NYC, New York..."
          id="origin"
          required
        />

        <AirportAutocomplete
          value={formData.destination}
          onChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
          label="To"
          placeholder="HND, TYO, Tokyo..."
          id="destination"
          required
        />

        <div>
          <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
            Departure Date
          </label>
          <input
            type="date"
            id="departureDate"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
            Return Date (Optional)
          </label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
            value={formData.returnDate || ''}
            onChange={handleChange}
            min={formData.departureDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
            Adults
          </label>
          <input
            type="number"
            id="adults"
            name="adults"
            value={formData.adults}
            onChange={handleChange}
            min={1}
            max={9}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
            Children
          </label>
          <input
            type="number"
            id="children"
            name="children"
            value={formData.children}
            onChange={handleChange}
            min={0}
            max={9}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cabinClass" className="block text-sm font-medium text-gray-700 mb-1">
            Cabin Class
          </label>
          <select
            id="cabinClass"
            name="cabinClass"
            value={formData.cabinClass}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>

        <div>
          <label htmlFor="maxLayovers" className="block text-sm font-medium text-gray-700 mb-1">
            Max Layovers
          </label>
          <select
            id="maxLayovers"
            name="maxLayovers"
            value={formData.maxLayovers}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Direct only</option>
            <option value={1}>Up to 1</option>
            <option value={2}>Up to 2</option>
            <option value={3}>Up to 3</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="includeCreativeRouting"
          name="includeCreativeRouting"
          checked={formData.includeCreativeRouting}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="includeCreativeRouting" className="ml-2 block text-sm text-gray-900">
          Include creative routing (e.g., book separate flights via different hubs)
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Searching...' : 'Search Flights'}
      </Button>
    </form>
  );
}
