import React, { useState } from 'react';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { Plane, Search } from 'lucide-react';
import config from '../../config';

export function SmartBooking({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '', // Optional for round-trip flights
    currency: 'USD', // Default currency
  });
  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchFlights = async () => {
    setLoading(true);
    setError('');
    setFlightData(null);

    try {
      // Step 1: Authenticate with Amadeus API to get a token
      const authResponse = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.AMADEUS_API_KEY,
          client_secret: config.AMADEUS_API_SECRET,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const token = authResponse.data.access_token;

      // Step 2: Fetch flight offers
      const flightsResponse = await axios.get(
        'https://test.api.amadeus.com/v2/shopping/flight-offers',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            originLocationCode: formData.from,
            destinationLocationCode: formData.to,
            departureDate: formData.departureDate,
            returnDate: formData.returnDate || undefined, // Optional
            adults: 1,
            currencyCode: formData.currency,
          },
        }
      );

      setFlightData(flightsResponse.data.data);
    } catch (err: any) {
      console.error('Error fetching flights:', err);
      setError('Failed to fetch flight data. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Map of IATA codes to airport names and help/service numbers
  const airportDetails = {
    JFK: { name: 'John F. Kennedy International Airport', serviceNumber: '1-800-JFK-INFO' },
    LHR: { name: 'London Heathrow Airport', serviceNumber: '+44 844 335 1801' },
    CDG: { name: 'Charles de Gaulle Airport', serviceNumber: '+33 1 70 36 60 50' },
    DXB: { name: 'Dubai International Airport', serviceNumber: '+971 4 224 5555' },
    HND: { name: 'Tokyo Haneda Airport', serviceNumber: '+81 3 5757 6333' },
    // Add more mappings as needed
  };

  const getAirportDetails = (iataCode: string) => {
    return airportDetails[iataCode] || { name: 'Unknown Airport', serviceNumber: 'N/A' };
  };

  // Fetch airline names (for displaying full carrier name)
  const fetchAirlineName = (code: string) => {
    const airlines: { [key: string]: string } = {
      AA: 'American Airlines',
      BA: 'British Airways',
      DL: 'Delta Airlines',
      LH: 'Lufthansa',
      EK: 'Emirates',
      QR: 'Qatar Airways',
      SQ: 'Singapore Airlines',
      CX: 'Cathay Pacific',
      UA: 'United Airlines',
    };
    return airlines[code] || code; // Return the code if the name isn't in the list
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <Navigation onBack={onBack} title="Smart Booking" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flight Search Section */}
          <div className="neon-card bg-black/50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <Search className="w-6 h-6" />
              Flight Search
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="from"
                placeholder="From (e.g., JFK)"
                value={formData.from}
                onChange={handleInputChange}
                className="w-full bg-black border border-green-500/30 rounded-lg p-3"
              />
              <input
                type="text"
                name="to"
                placeholder="To (e.g., LHR)"
                value={formData.to}
                onChange={handleInputChange}
                className="w-full bg-black border border-green-500/30 rounded-lg p-3"
              />
              <label className="text-gray-400">Departure Date</label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="w-full bg-black border border-green-500/30 rounded-lg p-3"
              />
              <label className="text-gray-400">Return Date (Optional)</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="w-full bg-black border border-green-500/30 rounded-lg p-3"
              />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full bg-black border border-green-500/30 rounded-lg p-3"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="INR">Indian Rupee (INR)</option>
              </select>
              <button
                onClick={fetchFlights}
                className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 p-3 rounded-lg neon-card"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {flightData && (
          <div className="mt-8 neon-card bg-black/50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-green-400 mb-4">Flight Results</h3>
            <ul className="space-y-4">
              {flightData.map((flight: any, index: number) => {
                const departure = flight.itineraries[0].segments[0].departure;
                const arrival = flight.itineraries[0].segments[0].arrival;

                const departureDetails = getAirportDetails(departure.iataCode);
                const arrivalDetails = getAirportDetails(arrival.iataCode);

                return (
                  <li key={index} className="p-4 border border-green-500/30 rounded-lg">
                    <h4 className="text-lg font-bold text-green-400 mb-2">Carrier: {fetchAirlineName(flight.validatingAirlineCodes[0])}</h4>
                    <p className="text-gray-300">
                      <strong>Flight Number:</strong>{' '}
                      {flight.itineraries[0].segments[0].carrierCode}-
                      {flight.itineraries[0].segments[0].number}
                    </p>
                    <div className="mt-2">
                      <h5 className="text-green-400">Departure</h5>
                      <p className="text-gray-300">
                        <strong>From:</strong> {departure.iataCode} ({departureDetails.name}) at{' '}
                        {new Date(departure.at).toLocaleString()}
                      </p>
                      <p className="text-gray-300">
                        <strong>Help & Service Number:</strong> {departureDetails.serviceNumber}
                      </p>
                    </div>
                    <div className="mt-2">
                      <h5 className="text-green-400">Arrival</h5>
                      <p className="text-gray-300">
                        <strong>To:</strong> {arrival.iataCode} ({arrivalDetails.name}) at{' '}
                        {new Date(arrival.at).toLocaleString()}
                      </p>
                      <p className="text-gray-300">
                        <strong>Help & Service Number:</strong> {arrivalDetails.serviceNumber}
                      </p>
                    </div>
                    <p className="text-green-400">
                      <strong>Price:</strong> {formData.currency} {flight.price.total}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
