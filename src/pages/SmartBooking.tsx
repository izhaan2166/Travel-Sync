import React, { useState } from 'react';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { Plane, Search, ExternalLink, Calendar, HelpCircle, Info, Compass } from 'lucide-react';
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
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const openGoogleFlights = () => {
    if (!formData.from || !formData.to || !formData.departureDate) {
      setError("Please fill out 'From' (origin), 'To' (destination), and 'Departure Date' to search on Google Flights.");
      return;
    }
    
    // Construct Google Flights search query URL
    let query = `Flights from ${formData.from} to ${formData.to} on ${formData.departureDate}`;
    if (formData.returnDate) {
      query += ` roundtrip return ${formData.returnDate}`;
    }
    const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const fetchFlights = async () => {
    if (!formData.from || !formData.to || !formData.departureDate) {
      setError("Please fill out 'From', 'To', and 'Departure Date' to run sandbox search.");
      return;
    }
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

      if (flightsResponse.data.data && flightsResponse.data.data.length > 0) {
        setFlightData(flightsResponse.data.data);
      } else {
        setError('No test flight offers found for this routing. (Note: Amadeus sandbox only lists specific mock flight routes).');
      }
    } catch (err: any) {
      console.error('Error fetching flights:', err);
      setError('Sandbox flight lookup failed. This is common when using restricted sandbox API keys for real flights.');
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
  };

  const getAirportDetails = (iataCode: string) => {
    return airportDetails[iataCode as keyof typeof airportDetails] || { name: 'Airport', serviceNumber: 'N/A' };
  };

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
    return airlines[code] || code;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-16 text-slate-100 pb-20">
      <Navigation onBack={onBack} title="Smart Flight Booking" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Flight Search Panel */}
          <div className="lg:col-span-5 neon-card bg-[#0f172a]/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-6 flex items-center gap-2">
              <Compass className="w-6 h-6 text-sky-400" />
              Find Your Flight
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">From</label>
                  <input
                    type="text"
                    name="from"
                    maxLength={3}
                    placeholder="e.g. JFK"
                    value={formData.from}
                    onChange={handleInputChange}
                    className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white uppercase outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">To</label>
                  <input
                    type="text"
                    name="to"
                    maxLength={3}
                    placeholder="e.g. LHR"
                    value={formData.to}
                    onChange={handleInputChange}
                    className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white uppercase outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Departure Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Return Date (Optional)</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={openGoogleFlights}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.2)] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search on Google Flights
                  <ExternalLink className="w-4 h-4 ml-1" />
                </button>

                <div className="flex items-center my-2 text-slate-500 justify-center gap-2">
                  <span className="h-px bg-slate-800 w-full"></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider shrink-0">or local sandbox</span>
                  <span className="h-px bg-slate-800 w-full"></span>
                </div>

                <button
                  onClick={fetchFlights}
                  className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-xl text-xs font-semibold tracking-wide transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'Searching local Sandbox...' : 'Run Amadeus Sandbox Lookup'}
                </button>
              </div>
            </div>
          </div>

          {/* Results and Information Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Google Flights Callout */}
            <div className="bg-[#0f172a]/30 border border-sky-500/20 rounded-2xl p-6 flex gap-4 items-start shadow-md">
              <Info className="w-8 h-8 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-sky-300">Live Flights via Google</h3>
                <p className="text-slate-400 text-sm leading-relaxed mt-1">
                  Because local sandboxed travel APIs have static testing records, searching on **Google Flights** provides you with real-time itineraries, live availability, ticket pricing, and options to book directly with airlines.
                </p>
              </div>
            </div>

            {/* Error display with immediate Google Flights button */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <p className="text-red-400 font-semibold mb-3">{error}</p>
                <button
                  onClick={openGoogleFlights}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  Search on Google Flights Instead
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Sandbox Flights Results */}
            {flightData && (
              <div className="neon-card bg-[#0f172a]/60 border border-slate-850 p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-4 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-sky-400" />
                  Sandbox Test Offers
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {flightData.map((flight: any, index: number) => {
                    const departure = flight.itineraries[0].segments[0].departure;
                    const arrival = flight.itineraries[0].segments[0].arrival;

                    const departureDetails = getAirportDetails(departure.iataCode);
                    const arrivalDetails = getAirportDetails(arrival.iataCode);

                    return (
                      <div key={index} className="p-4 bg-[#070b13]/80 border border-slate-800 hover:border-sky-500/20 rounded-xl transition duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-md font-bold text-sky-400">{fetchAirlineName(flight.validatingAirlineCodes[0])}</h4>
                          <span className="text-xs font-bold text-indigo-400 font-mono">
                            {formData.currency} {flight.price.total}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-slate-500 font-bold uppercase tracking-wider">Departure</p>
                            <p className="text-slate-200 mt-1 font-semibold">{departure.iataCode} ({departureDetails.name})</p>
                            <p className="text-slate-400 mt-0.5">{new Date(departure.at).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 font-bold uppercase tracking-wider">Arrival</p>
                            <p className="text-slate-200 mt-1 font-semibold">{arrival.iataCode} ({arrivalDetails.name})</p>
                            <p className="text-slate-400 mt-0.5">{new Date(arrival.at).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-3 pt-3 border-t border-slate-900">
                          <span>Flight No: {flight.itineraries[0].segments[0].carrierCode}-{flight.itineraries[0].segments[0].number}</span>
                          <span>Airport Support: {departureDetails.serviceNumber}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
