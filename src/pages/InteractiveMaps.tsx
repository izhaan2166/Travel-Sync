import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { Navigation } from '../components/navigation/Navigation';
import { Search, Bookmark, Sun, RefreshCw } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export function InteractiveMaps({ onBack }: { onBack: () => void }) {
  const { showToast } = useToast();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<tt.Map | null>(null);
  const [searchResults, setSearchResults] = useState<tt.SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);
  const [isRouteReady, setIsRouteReady] = useState(false);
  const [weather, setWeather] = useState<{ temp: number; description: string } | null>(null);
  const [destinationWeather, setDestinationWeather] = useState<{ temp: number; description: string } | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>([4.899, 52.372]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [isDestinationSuggestionsVisible, setIsDestinationSuggestionsVisible] = useState(false);
  const [routingLoading, setRoutingLoading] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mapElement.current) {
      mapInstance.current = tt.map({
        key: 'sf5ztt5sJtkhzSJsbOpjshC83JAAcVSH',
        container: mapElement.current,
        center: currentCoordinates,
        zoom: 10,
      });

      fetchWeather(currentCoordinates);

      return () => mapInstance.current?.remove();
    }
  }, []);

  const centerMap = (coordinates: [number, number]) => {
    setCurrentCoordinates(coordinates);
    mapInstance.current?.flyTo({ center: coordinates, zoom: 14 });
    fetchWeather(coordinates);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(searchQuery)}.json?key=sf5ztt5sJtkhzSJsbOpjshC83JAAcVSH`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.results || []);
      setIsSuggestionsVisible(true);
    } catch (e) {
      showToast('Error looking up starting location', 'error');
    }
  };

  const fetchWeather = async (coordinates: [number, number], isDestination = false) => {
    const [lon, lat] = coordinates;
    const weatherApiKey = '9637ec97cb78922c26f0f754eadfe822';
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`
      );
      if (!response.ok) throw new Error('Weather lookup failed');
      const data = await response.json();
      const weatherData = {
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
      };

      if (isDestination) {
        setDestinationWeather(weatherData);
      } else {
        setWeather(weatherData);
      }
    } catch (e) {
      console.warn('Weather API failed to respond.');
    }
  };

  const handleDestinationSearch = async () => {
    if (!destinationQuery.trim()) return;
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(destinationQuery)}.json?key=sf5ztt5sJtkhzSJsbOpjshC83JAAcVSH`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.results || []);
      setIsDestinationSuggestionsVisible(true);
    } catch (e) {
      showToast('Error looking up destination location', 'error');
    }
  };

  const handleSearchSelect = (result: tt.SearchResult) => {
    const coordinates: [number, number] = [result.position.lon, result.position.lat];
    setCurrentCoordinates(coordinates);
    centerMap(coordinates);
    setSearchQuery(result.poi?.name || result.address.freeformAddress);
    setIsSuggestionsVisible(false);
    fetchWeather(coordinates);
    showToast('Starting location updated.', 'info');
  };

  const handleDestinationSelect = (result: tt.SearchResult) => {
    const coordinates: [number, number] = [result.position.lon, result.position.lat];
    setDestinationCoordinates(coordinates);
    setIsRouteReady(true);
    setDestinationQuery(result.poi?.name || result.address.freeformAddress);
    setIsDestinationSuggestionsVisible(false);
    mapInstance.current?.flyTo({ center: coordinates, zoom: 14 });
    fetchWeather(coordinates, true);
    showToast('Destination verified. Ready for navigation.', 'success');
  };

  const clearPreviousRoute = () => {
    const existingRouteLayer = mapInstance.current?.getLayer('route');
    if (existingRouteLayer) {
      mapInstance.current?.removeLayer('route');
      mapInstance.current?.removeSource('route');
    }
  };

  const calculateRoute = async () => {
    if (!destinationCoordinates) {
      showToast('Please select a destination.', 'error');
      return;
    }

    setRoutingLoading(true);
    clearPreviousRoute();

    try {
      const response = await fetch(
        `https://api.tomtom.com/routing/1/calculateRoute/${currentCoordinates[1]},${currentCoordinates[0]}:${destinationCoordinates[1]},${destinationCoordinates[0]}/json?key=sf5ztt5sJtkhzSJsbOpjshC83JAAcVSH&travelMode=car`
      );
      if (!response.ok) throw new Error('Routing calculation failed');
      const data = await response.json();
      const geoJson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: data.routes[0].legs[0].points.map((point: any) => [
                point.longitude,
                point.latitude,
              ]),
            },
          },
        ],
      };

      mapInstance.current?.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geoJson,
        },
        paint: {
          'line-color': '#00A896',
          'line-width': 5,
        },
      });

      const bounds = new tt.LngLatBounds();
      data.routes[0].legs[0].points.forEach((point: any) => {
        bounds.extend([point.longitude, point.latitude]);
      });
      mapInstance.current?.fitBounds(bounds, { padding: 30 });
      showToast('Telemetry route vectors plotted successfully.', 'success');
    } catch (e) {
      showToast('Failed to calculate route metrics.', 'error');
    } finally {
      setRoutingLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 text-slate-800 pb-20 relative overflow-hidden flex flex-col justify-between bg-[#FAFAFA]">
      <Navigation onBack={onBack} title="Interactive Journey Map" />
      
      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-12 py-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto w-full">
          
          {/* Left / Center map column */}
          <div className="lg:col-span-3 travel-card p-4 rounded-[20px] relative bg-white border border-slate-200 shadow-sm min-h-[450px] sm:min-h-[550px]">
            <div
              ref={mapElement}
              className="w-full h-[420px] sm:h-[520px] border border-slate-200 rounded-xl overflow-hidden shadow-inner"
            />
          </div>

          {/* Right column: Search & Weather */}
          <div className="space-y-6">
            {/* Step 1: Starting Location */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative text-left">
              <h3 className="text-sm font-bold text-[#0F3D91] mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#00A896]" />
                Starting Location
              </h3>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                placeholder="Enter starting location..."
                className="w-full travel-input p-3 text-slate-800 text-xs sm:text-sm font-medium"
              />
              <ul className={`mt-3 space-y-1.5 max-h-[150px] overflow-y-auto ${isSuggestionsVisible ? '' : 'hidden'}`}>
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    onClick={() => handleSearchSelect(result)}
                    className="p-2.5 text-[11px] border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-[#00A896] cursor-pointer text-slate-700 font-semibold transition"
                  >
                    {result.poi?.name || result.address.freeformAddress}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 2: Destination */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative text-left">
              <h3 className="text-sm font-bold text-[#0F3D91] mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#00A896]" />
                Destination
              </h3>
              <input
                ref={destinationRef}
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                onKeyUp={handleDestinationSearch}
                placeholder="Enter destination location..."
                className="w-full travel-input p-3 text-slate-800 text-xs sm:text-sm font-medium"
              />
              <ul className={`mt-3 space-y-1.5 max-h-[150px] overflow-y-auto ${isDestinationSuggestionsVisible ? '' : 'hidden'}`}>
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    onClick={() => handleDestinationSelect(result)}
                    className="p-2.5 text-[11px] border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-[#00A896] cursor-pointer text-slate-700 font-semibold transition"
                  >
                    {result.poi?.name || result.address.freeformAddress}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3: Start Navigation Button */}
            {isRouteReady && (
              <div className="travel-card p-4 rounded-[20px] bg-white border border-slate-200 shadow-sm relative">
                <button
                  onClick={calculateRoute}
                  disabled={routingLoading}
                  className="w-full py-3.5 btn-primary font-bold text-xs uppercase tracking-wider transition hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {routingLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Plotting Route...
                    </>
                  ) : (
                    'Start Navigation'
                  )}
                </button>
              </div>
            )}

            {/* Weather Card */}
            <div className="travel-card p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm relative text-left">
              <h3 className="text-sm font-bold text-[#0F3D91] mb-4 flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#00A896]" />
                Weather Conditions
              </h3>
              <div className="space-y-4">
                {weather ? (
                  <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl text-xs space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-widest font-mono text-[9px]">Starting Location</p>
                    <p className="text-[#0F3D91] text-lg font-black font-mono mt-1">{weather.temp}°C</p>
                    <p className="text-slate-655 capitalize font-medium">{weather.description}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-455 italic font-semibold">Loading weather...</p>
                )}
                {destinationWeather && (
                  <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl text-xs space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-widest font-mono text-[9px]">Destination</p>
                    <p className="text-[#00A896] text-lg font-black font-mono mt-1">{destinationWeather.temp}°C</p>
                    <p className="text-slate-655 capitalize font-medium">{destinationWeather.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
