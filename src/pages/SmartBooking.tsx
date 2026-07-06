import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigation } from '../components/navigation/Navigation';
import { Plane, Search, ExternalLink, Calendar, Info, Compass, MapPin, ArrowRight, DollarSign, Filter, AlertCircle } from 'lucide-react';
import config from '../../config';
import { AIRPORTS } from '../constants/airports';
import { useToast } from '../components/common/Toast';
import axiosInstance from 'axios';

export function SmartBooking({ onBack }: { onBack: () => void }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
  });

  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  const [currency, setCurrency] = useState('USD');
  const [sortBy, setSortBy] = useState('best');

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<any>(null);
  const [error, setError] = useState('');

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
        score += 100;
      } else if (codeLower.startsWith(searchVal)) {
        score += 85;
      } else if (cityLower.startsWith(searchVal)) {
        score += 80;
      } else if (nameLower.startsWith(searchVal)) {
        score += 70;
      } else if (cityLower.includes(searchVal)) {
        score += 50;
      } else if (nameLower.includes(searchVal)) {
        score += 40;
      } else if (countryLower.includes(searchVal)) {
        score += 20;
      }
      
      return { ...a, score };
    });
    
    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.city.localeCompare(b.city);
      })
      .slice(0, 7);
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
      showToast("Please fill out 'Where from?', 'Where to?', and departure date.", "error");
      return;
    }
    
    const depDateStr = formatDate(startDate);
    const retDateStr = formatDate(endDate);
    
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
      showToast("Fill out starting airport, destination, and departure date.", "error");
      return;
    }
    if (tripType === 'round-trip' && !endDate) {
      showToast("Select a return date for your round-trip route.", "error");
      return;
    }

    setLoading(true);
    setError('');
    setFlightData(null);

    try {
      const authResponse = await axiosInstance.post(
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

      const flightsResponse = await axiosInstance.get(
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
        showToast(`Matched ${flightsResponse.data.data.length} sandbox flight offers!`, 'success');
      } else {
        setError('No test flight offers found in sandbox for this routing.');
        showToast('Lookup completed. No sandbox matches.', 'info');
      }
    } catch (err: any) {
      console.error('Error fetching flights:', err);
      setError('Sandbox flight lookup failed. This is common when using sandbox API keys for real routing.');
      showToast('API sandbox lookup failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
    return flights;
  };

  const formatItineraryDuration = (durationStr: string) => {
    const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!matches) return durationStr;
    const hours = matches[1] ? `${matches[1]}h` : '';
    const minutes = matches[2] ? `${matches[2]}m` : '';
    return `${hours} ${minutes}`.trim();
  };

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights();
  };

  return (
    <div className="min-h-screen pt-24 text-slate-800 pb-20 relative overflow-hidden flex flex-col justify-between bg-[#FAFAFA]">
      <Navigation onBack={onBack} title="Smart Flight Booking" />
      
      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-12 py-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto w-full">
          
          {/* Flight Search Panel */}
          <form onSubmit={handleFormSubmit} className="lg:col-span-5 travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
            <fieldset disabled={loading}>
              <legend className="sr-only">Flight Parameters</legend>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-bold text-[#0F3D91] tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#00A896]" />
                  Find Flight
                </h2>

                {/* Trip Type Toggles */}
                <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs font-semibold shrink-0" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tripType === 'round-trip'}
                    onClick={() => {
                      setTripType('round-trip');
                      setDateRange([null, null]);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      tripType === 'round-trip' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Round-trip
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tripType === 'one-way'}
                    onClick={() => {
                      setTripType('one-way');
                      setDateRange([null, null]);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      tripType === 'one-way' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    One-way
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Where from? Field */}
                  <div className="relative text-left">
                    <label htmlFor="origin" className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono">Where from?</label>
                    <input
                      id="origin"
                      type="text"
                      required
                      placeholder="Origin City / Code"
                      value={formData.from}
                      onChange={handleFromChange}
                      onFocus={() => {
                        setShowFromDropdown(true);
                        setFromSuggestions(filterAirports(formData.from));
                      }}
                      onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                      className="w-full travel-input p-3 text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-medium"
                    />
                    {showFromDropdown && fromSuggestions.length > 0 && (
                      <div className="absolute z-50 left-0 mt-1.5 w-[280px] sm:w-[350px] bg-white border border-slate-200 rounded-[20px] max-h-80 overflow-y-auto shadow-xl p-2 space-y-1">
                        {fromSuggestions.map((a) => (
                          <div
                            key={a.code}
                            onMouseDown={() => handleSelectFrom(a.code)}
                            className="p-3 hover:bg-slate-50 hover:text-[#00A896] cursor-pointer rounded-xl flex justify-between items-center text-left text-xs transition border border-transparent hover:border-slate-100"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#0F3D91]/5 border border-[#0F3D91]/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-3.5 h-3.5 text-[#0F3D91]" />
                              </div>
                              <div className="truncate max-w-[150px]">
                                <p className="font-bold text-slate-850 text-xs leading-tight">{a.city}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{a.name}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-bold text-[#0F3D91] bg-[#0F3D91]/5 px-2 py-0.5 rounded border border-[#0F3D91]/10 font-mono uppercase">
                                {a.code}
                              </span>
                              <p className="text-[9px] text-slate-400 mt-0.5 uppercase font-semibold font-mono">{a.country}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Where to? Field */}
                  <div className="relative text-left">
                    <label htmlFor="destination" className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono">Where to?</label>
                    <input
                      id="destination"
                      type="text"
                      required
                      placeholder="Destination City / Code"
                      value={formData.to}
                      onChange={handleToChange}
                      onFocus={() => {
                        setShowToDropdown(true);
                        setToSuggestions(filterAirports(formData.to));
                      }}
                      onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                      className="w-full travel-input p-3 text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-medium"
                    />
                    {showToDropdown && toSuggestions.length > 0 && (
                      <div className="absolute z-50 right-0 mt-1.5 w-[280px] sm:w-[350px] bg-white border border-slate-200 rounded-[20px] max-h-80 overflow-y-auto shadow-xl p-2 space-y-1">
                        {toSuggestions.map((a) => (
                          <div
                            key={a.code}
                            onMouseDown={() => handleSelectTo(a.code)}
                            className="p-3 hover:bg-slate-50 hover:text-[#00A896] cursor-pointer rounded-xl flex justify-between items-center text-left text-xs transition border border-transparent hover:border-slate-100"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#0F3D91]/5 border border-[#0F3D91]/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-3.5 h-3.5 text-[#0F3D91]" />
                              </div>
                              <div className="truncate max-w-[150px]">
                                <p className="font-bold text-slate-850 text-xs leading-tight">{a.city}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{a.name}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-bold text-[#0F3D91] bg-[#0F3D91]/5 px-2 py-0.5 rounded border border-[#0F3D91]/10 font-mono uppercase">
                                {a.code}
                              </span>
                              <p className="text-[9px] text-slate-400 mt-0.5 uppercase font-semibold font-mono">{a.country}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Datepicker Field */}
                <div className="relative text-left">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono">
                    {tripType === 'round-trip' ? 'Dates (Departure - Return)' : 'Date (Departure)'}
                  </span>
                  <div className="w-full travel-input p-3 flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-[#00A896] shrink-0" />
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
                      className="bg-transparent text-slate-800 w-full outline-none text-xs sm:text-sm placeholder-slate-400 cursor-pointer font-medium"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      isClearable={true}
                    />
                  </div>
                </div>

                {/* Currency Field */}
                <div className="text-left">
                  <label htmlFor="currency" className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#00A896]" />
                    Pricing Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-750 text-xs sm:text-sm font-semibold outline-none focus:border-[#00A896] transition"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="INR">Indian Rupee (INR)</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={openGoogleFlights}
                    className="w-full py-3.5 btn-teal text-xs uppercase tracking-wider font-bold shadow-sm hover:scale-[1.01] transition flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Google Flights Link
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center my-2 text-slate-400 justify-center gap-2">
                    <span className="h-px bg-slate-200 w-full"></span>
                    <span className="text-[9px] uppercase font-bold tracking-widest shrink-0 font-mono text-slate-400">or local sandbox</span>
                    <span className="h-px bg-slate-200 w-full"></span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 btn-secondary text-xs uppercase tracking-wider text-slate-650"
                  >
                    Run Amadeus Sandbox Lookup
                  </button>
                </div>
              </div>
            </fieldset>
          </form>

          {/* Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Info Callout */}
            <div className="travel-card p-6 border border-slate-200 flex gap-4 items-start relative overflow-hidden text-left bg-white shadow-sm">
              <Info className="w-7 h-7 text-[#00A896] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-[#0F3D91] leading-tight">Live Flights via Google</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-1.5 font-medium">
                  Because local sandboxed travel APIs have static testing records, searching on **Google Flights** provides you with real-time itineraries, live availability, ticket pricing, and options to book directly with airlines.
                </p>
              </div>
            </div>

            {/* Loading Skeleton Panel */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-5 travel-card border border-slate-200 bg-white space-y-4 animate-pulse text-left shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                        <div className="h-3 bg-slate-100 rounded w-20"></div>
                      </div>
                      <div className="h-6 bg-slate-200 rounded w-16"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-10"></div>
                        <div className="h-4 bg-slate-200 rounded w-36"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-10"></div>
                        <div className="h-4 bg-slate-200 rounded w-36"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error display */}
            {error && !loading && (
              <div className="bg-red-500/5 border border-red-500/25 rounded-[20px] p-6 text-left">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-650 font-bold text-sm leading-none">Sandbox Lookup Unsuccessful</p>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold">{error}</p>
                  </div>
                </div>
                <button
                  onClick={openGoogleFlights}
                  className="mt-4 px-4 py-2.5 btn-teal text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  Search on Google Flights
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Meaningful Search Empty State */}
            {!flightData && !loading && !error && (
              <div className="travel-card p-10 rounded-[20px] border border-slate-200 bg-white text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#00A896]/5 border border-[#00A896]/15 flex items-center justify-center text-[#00A896] mx-auto animate-float">
                  <Plane className="w-6 h-6 rotate-45" />
                </div>
                <h4 className="text-base font-bold text-[#0F3D91] leading-none">No Sandbox Offers Searched</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                  Enter your flight origin, destination, and travel dates on the search panel to perform a sandbox query.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ from: 'JFK', to: 'HND' });
                    setDateRange([new Date(Date.now() + 24*60*60*1000), new Date(Date.now() + 8*24*60*60*1000)]);
                    showToast('Sample routes loaded. Run Amadeus lookup to preview sandbox details.', 'info');
                  }}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 text-[#0F3D91] font-mono"
                >
                  Load Sample JFK ➔ HND Route
                </button>
              </div>
            )}

            {/* Sandbox Flights Results */}
            {flightData && !loading && (
              <div className="travel-card border border-slate-200 bg-white p-6 rounded-[20px] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-[#0F3D91] flex items-center gap-2">
                    <Plane className="w-5 h-5 text-[#00A896]" />
                    Sandbox Test Offers
                  </h3>

                  {/* Sorting Panel */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-450 flex items-center gap-1 font-bold uppercase tracking-widest font-mono text-[9px]">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      Sort by:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-700 font-semibold outline-none transition focus:border-[#00A896]"
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
                      <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 leading-tight">{fetchAirlineName(flight.validatingAirlineCodes[0])}</h4>
                            <p className="text-[10px] text-slate-450 font-bold uppercase tracking-widest font-mono mt-1">
                              Duration: {formatItineraryDuration(durationStr)}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#00A896] font-mono bg-[#00A896]/5 px-2.5 py-1 border border-[#00A896]/20 rounded-lg">
                            {currency} {flight.price.total}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs mt-2.5">
                          <div>
                            <p className="text-[9px] text-slate-450 font-bold uppercase tracking-widest font-mono">Departure</p>
                            <p className="text-slate-700 mt-1 font-semibold leading-tight">{departure.iataCode} ({departureDetails.name})</p>
                            <p className="text-slate-500 text-[10px] mt-1 font-mono">{new Date(departure.at).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-450 font-bold uppercase tracking-widest font-mono">Arrival</p>
                            <p className="text-slate-700 mt-1 font-semibold leading-tight">{arrival.iataCode} ({arrivalDetails.name})</p>
                            <p className="text-slate-500 text-[10px] mt-1 font-mono">{new Date(arrival.at).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-200">
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
