import React, { useState } from 'react';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { Plane, Search, ExternalLink, Calendar, HelpCircle, Info, Compass } from 'lucide-react';
import config from '../../config';

// Major global airports dataset
const AIRPORTS = [
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia' },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia' },
  { code: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia' },
  { code: 'MED', name: 'Prince Mohammad bin Abdulaziz Airport', city: 'Medina', country: 'Saudi Arabia' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'AUH', name: 'Zayed International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Airport', city: 'Mumbai', country: 'India' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { code: 'AMS', name: 'Schiphol Airport', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'Italy' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain' },
  { code: 'SYD', name: 'Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico' },
  { code: 'GRU', name: 'Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
  { code: 'GIG', name: 'Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil' },
  { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina' }
];

export function SmartBooking({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
  });
  
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<any>(null);
  const [error, setError] = useState('');

  const filterAirports = (val: string) => {
    if (!val) return [];
    const searchVal = val.toLowerCase();
    return AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(searchVal) ||
        a.name.toLowerCase().includes(searchVal) ||
        a.city.toLowerCase().includes(searchVal) ||
        a.country.toLowerCase().includes(searchVal)
    ).slice(0, 5); // Return top 5 suggestions
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, from: val }));
    setFromSuggestions(filterAirports(val));
    setShowFromDropdown(true);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, to: val }));
    setToSuggestions(filterAirports(val));
    setShowToDropdown(true);
  };

  const handleSelectFrom = (code: string) => {
    setFormData((prev) => ({ ...prev, from: code }));
    setShowFromDropdown(false);
  };

  const handleSelectTo = (code: string) => {
    setFormData((prev) => ({ ...prev, to: code }));
    setShowToDropdown(false);
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

      // Step 2: Fetch flight offers in default USD currency
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
            currencyCode: 'USD',
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
    JED: { name: 'King Abdulaziz International Airport', serviceNumber: '+966 9200 11233' },
    RUH: { name: 'King Khalid International Airport', serviceNumber: '+966 9200 20090' },
    DMM: { name: 'King Fahd International Airport', serviceNumber: '+966 13 883 1000' },
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
                {/* From Field */}
                <div className="relative">
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">From</label>
                  <input
                    type="text"
                    placeholder="Origin (e.g. JED)"
                    value={formData.from}
                    onChange={handleFromChange}
                    onFocus={() => {
                      setShowFromDropdown(true);
                      setFromSuggestions(filterAirports(formData.from));
                    }}
                    onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                    className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white uppercase outline-none transition"
                  />
                  {showFromDropdown && fromSuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-[#0f172a] border border-slate-800 rounded-xl max-h-60 overflow-y-auto shadow-2xl">
                      {fromSuggestions.map((a) => (
                        <div
                          key={a.code}
                          onMouseDown={() => handleSelectFrom(a.code)}
                          className="p-3 hover:bg-sky-500/10 hover:text-sky-400 cursor-pointer flex justify-between items-center text-left text-xs transition border-b border-slate-850 last:border-b-0"
                        >
                          <div>
                            <p className="font-bold text-slate-200">{a.city} ({a.code})</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{a.name}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 ml-1">{a.country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* To Field */}
                <div className="relative">
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">To</label>
                  <input
                    type="text"
                    placeholder="Destination (e.g. LHR)"
                    value={formData.to}
                    onChange={handleToChange}
                    onFocus={() => {
                      setShowToDropdown(true);
                      setToSuggestions(filterAirports(formData.to));
                    }}
                    onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                    className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white uppercase outline-none transition"
                  />
                  {showToDropdown && toSuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-[#0f172a] border border-slate-800 rounded-xl max-h-60 overflow-y-auto shadow-2xl">
                      {toSuggestions.map((a) => (
                        <div
                          key={a.code}
                          onMouseDown={() => handleSelectTo(a.code)}
                          className="p-3 hover:bg-sky-500/10 hover:text-sky-400 cursor-pointer flex justify-between items-center text-left text-xs transition border-b border-slate-850 last:border-b-0"
                        >
                          <div>
                            <p className="font-bold text-slate-200">{a.city} ({a.code})</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{a.name}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 ml-1">{a.country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Departure Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
                  className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Return Date (Optional)</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition"
                />
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
                            USD {flight.price.total}
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
