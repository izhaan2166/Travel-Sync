import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigation } from '../components/Navigation';
import { Plane, Search, ExternalLink, Calendar, Info, Compass, MapPin, ArrowRightLeft, ArrowRight, DollarSign, Filter } from 'lucide-react';
import config from '../../config';
import { AIRPORTS } from '../data/airports';

export function SmartBooking({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
  });

  // Toggles & configs
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  const [currency, setCurrency] = useState('USD');
  const [sortBy, setSortBy] = useState('best'); // 'best' | 'price_low' | 'duration_short'

  // Date Range (Departure / Return in the same place)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<any>(null);
  const [error, setError] = useState('');

  // Weighted relevance search scoring algorithm
  const filterAirports = (val: string) => {
    if (!val) return [];
    const searchVal = val.toLowerCase().trim();
    
    const scored = AIRPORTS.map((a) => {
      let score = 0;
      const codeLower = a.code.toLowerCase();
      const cityLower = a.city.toLowerCase();
      const nameLower = a.name.toLowerCase();
      const countryLower = a.country.toLowerCase();
      
      if (codeLower === searchVal) {
        score += 100; // Exact IATA code match
      } else if (codeLower.startsWith(searchVal)) {
        score += 85;  // IATA code prefix match
      } else if (cityLower.startsWith(searchVal)) {
        score += 80;  // City name prefix match
      } else if (nameLower.startsWith(searchVal)) {
        score += 70;  // Airport name prefix match
      } else if (cityLower.includes(searchVal)) {
        score += 50;  // City substring match
      } else if (nameLower.includes(searchVal)) {
        score += 40;  // Airport name substring match
      } else if (countryLower.includes(searchVal)) {
        score += 20;  // Country substring match
      }
      
      return { ...a, score };
    });
    
    // Filter matches, sort by highest score, then by city alphabetically
    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.city.localeCompare(b.city);
      })
      .slice(0, 7); // Return top 7 matching results
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

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  };

  const openGoogleFlights = () => {
    if (!formData.from || !formData.to || !startDate) {
      setError("Please fill out 'Where from?', 'Where to?', and departure date to search on Google Flights.");
      return;
    }
    
    const depDateStr = formatDate(startDate);
    const retDateStr = formatDate(endDate);
    
    // Construct Google Flights search query URL
    let query = `Flights from ${formData.from} to ${formData.to} on ${depDateStr}`;
    if (tripType === 'round-trip' && endDate) {
      query += ` roundtrip return ${retDateStr}`;
    } else {
      query += ` oneway`;
    }
    const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const fetchFlights = async () => {
    if (!formData.from || !formData.to || !startDate) {
      setError("Please fill out 'Where from?', 'Where to?', and departure date to run sandbox search.");
      return;
    }
    if (tripType === 'round-trip' && !endDate) {
      setError("Please select a return date for your round-trip flight.");
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

      // Step 2: Fetch flight offers in selected currency
      const flightsResponse = await axios.get(
        'https://test.api.amadeus.com/v2/shopping/flight-offers',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            originLocationCode: formData.from.toUpperCase(),
            destinationLocationCode: formData.to.toUpperCase(),
            departureDate: formatDate(startDate),
            returnDate: tripType === 'round-trip' ? formatDate(endDate) : undefined,
            adults: 1,
            currencyCode: currency,
          },
        }
      );

      if (flightsResponse.data.data && flightsResponse.data.data.length > 0) {
        setFlightData(flightsResponse.data.data);
      } else {
        setError('No test flight offers found in sandbox for this routing.');
      }
    } catch (err: any) {
      console.error('Error fetching flights:', err);
      setError('Sandbox flight lookup failed. This is common when using sandbox API keys for real routing.');
    } finally {
      setLoading(false);
    }
  };

  // Parse ISO 8601 duration (like "PT2H30M") to total minutes for sorting
  const parseDuration = (durationStr: string): number => {
    const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!matches) return 0;
    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    return hours * 60 + minutes;
  };

  const getSortedFlights = () => {
    if (!flightData) return [];
    const flights = [...flightData];
    if (sortBy === 'price_low') {
      return flights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
    }
    if (sortBy === 'duration_short') {
      return flights.sort((a, b) => {
        const durA = parseDuration(a.itineraries[0].duration);
        const durB = parseDuration(b.itineraries[0].duration);
        return durA - durB;
      });
    }
    return flights; // default 'best' (as returned from API)
  };

  const formatItineraryDuration = (durationStr: string) => {
    const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!matches) return durationStr;
    const hours = matches[1] ? `${matches[1]}h` : '';
    const minutes = matches[2] ? `${matches[2]}m` : '';
    return `${hours} ${minutes}`.trim();
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center gap-2">
                <Compass className="w-6 h-6 text-sky-400" />
                Find Your Flight
              </h2>

              {/* Trip Type Toggles */}
              <div className="flex bg-[#070b13] border border-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => {
                    setTripType('round-trip');
                    setDateRange([null, null]);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    tripType === 'round-trip' ? 'bg-sky-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Round-trip
                </button>
                <button
                  onClick={() => {
                    setTripType('one-way');
                    setDateRange([null, null]);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    tripType === 'one-way' ? 'bg-sky-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  One-way
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Where from? Field */}
                <div className="relative">
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Where from?</label>
                  <input
                    type="text"
                    placeholder="Origin City / Code"
                    value={formData.from}
                    onChange={handleFromChange}
                    onFocus={() => {
                      setShowFromDropdown(true);
                      setFromSuggestions(filterAirports(formData.from));
                    }}
                    onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                    className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition placeholder-slate-750"
                  />
                  {showFromDropdown && fromSuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 mt-1.5 w-[280px] sm:w-[350px] md:w-[450px] bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/80 rounded-2xl max-h-80 overflow-y-auto shadow-2xl p-2 space-y-1">
                      {fromSuggestions.map((a) => (
                        <div
                          key={a.code}
                          onMouseDown={() => handleSelectFrom(a.code)}
                          className="p-3.5 hover:bg-sky-500/10 hover:text-sky-400 cursor-pointer rounded-xl flex justify-between items-center text-left text-xs transition border border-transparent hover:border-sky-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-sky-400" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-100 text-sm leading-tight">{a.city}</p>
                              <p className="text-[11px] text-slate-450 mt-0.5 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[260px]">{a.name}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 font-mono uppercase">
                              {a.code}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold tracking-wider">{a.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Where to? Field */}
                <div className="relative">
                  <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Where to?</label>
                  <input
                    type="text"
                    placeholder="Destination City / Code"
                    value={formData.to}
                    onChange={handleToChange}
                    onFocus={() => {
                      setShowToDropdown(true);
                      setToSuggestions(filterAirports(formData.to));
                    }}
                    onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                    className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition placeholder-slate-750"
                  />
                  {showToDropdown && toSuggestions.length > 0 && (
                    <div className="absolute z-50 right-0 mt-1.5 w-[280px] sm:w-[350px] md:w-[450px] bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/80 rounded-2xl max-h-80 overflow-y-auto shadow-2xl p-2 space-y-1">
                      {toSuggestions.map((a) => (
                        <div
                          key={a.code}
                          onMouseDown={() => handleSelectTo(a.code)}
                          className="p-3.5 hover:bg-sky-500/10 hover:text-sky-400 cursor-pointer rounded-xl flex justify-between items-center text-left text-xs transition border border-transparent hover:border-sky-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-sky-400" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-100 text-sm leading-tight">{a.city}</p>
                              <p className="text-[11px] text-slate-450 mt-0.5 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[260px]">{a.name}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 font-mono uppercase">
                              {a.code}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold tracking-wider">{a.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Integrated Calendar (Selects Departure/Return in same popover) */}
              <div className="relative">
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                  {tripType === 'round-trip' ? 'Dates (Departure - Return)' : 'Date (Departure)'}
                </label>
                <div className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus-within:border-sky-500 rounded-xl p-3 flex items-center gap-2.5 transition">
                  <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                  <DatePicker
                    selectsRange={tripType === 'round-trip'}
                    startDate={startDate}
                    endDate={endDate}
                    selected={tripType === 'one-way' ? startDate : undefined}
                    onChange={(update: any) => {
                      if (tripType === 'round-trip') {
                        setDateRange(update);
                      } else {
                        setDateRange([update, null]);
                      }
                    }}
                    placeholderText={tripType === 'round-trip' ? "Choose departure - return dates" : "Choose departure date"}
                    className="bg-transparent text-white w-full outline-none text-sm placeholder-slate-650 cursor-pointer"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    isClearable={true}
                  />
                </div>
              </div>

              {/* Sandbox Currency Configuration */}
              <div>
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-sky-400" />
                  Sandbox Pricing Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#070b13] border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl p-3 text-white outline-none transition text-sm"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={openGoogleFlights}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.25)] hover:shadow-[0_0_20px_rgba(14,165,233,0.45)] transition duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-350 rounded-xl text-xs font-semibold tracking-wide transition duration-200"
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

            {/* Sandbox Flights Results & Sorting */}
            {flightData && (
              <div className="neon-card bg-[#0f172a]/60 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-sky-400" />
                    Sandbox Test Offers
                  </h3>

                  {/* Google-like Sorting Panel */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      Sort by:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[#070b13] border border-slate-800 rounded-lg p-1.5 text-slate-300 font-semibold outline-none transition focus:border-sky-500"
                    >
                      <option value="best">Best Flights</option>
                      <option value="price_low">Price (low to high)</option>
                      <option value="duration_short">Duration (shortest first)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {getSortedFlights().map((flight: any, index: number) => {
                    const departure = flight.itineraries[0].segments[0].departure;
                    const arrival = flight.itineraries[0].segments[0].arrival;
                    const durationStr = flight.itineraries[0].duration;

                    const departureDetails = getAirportDetails(departure.iataCode);
                    const arrivalDetails = getAirportDetails(arrival.iataCode);

                    return (
                      <div key={index} className="p-4 bg-[#070b13]/80 border border-slate-800 hover:border-sky-500/20 rounded-xl transition duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-md font-bold text-sky-400">{fetchAirlineName(flight.validatingAirlineCodes[0])}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                              Duration: {formatItineraryDuration(durationStr)}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-indigo-400 font-mono bg-indigo-500/5 px-2.5 py-1 border border-indigo-500/20 rounded-lg">
                            {currency} {flight.price.total}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs mt-2">
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

                        <div className="flex justify-between items-center text-[10px] text-slate-550 mt-3 pt-3 border-t border-slate-900">
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
