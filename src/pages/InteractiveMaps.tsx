import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { Navigation } from '../components/Navigation';
import { Map, Navigation2, Search, Bookmark, Sun } from 'lucide-react';

export function InteractiveMaps({ onBack }: { onBack: () => void }) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<tt.Map | null>(null);
  const [searchResults, setSearchResults] = useState<tt.SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);
  const [isRouteReady, setIsRouteReady] = useState(false); // Button will be enabled when route is ready
  const [weather, setWeather] = useState<{ temp: number; description: string } | null>(null);
  const [destinationWeather, setDestinationWeather] = useState<{ temp: number; description: string } | null>(null); // For destination weather
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>([4.899, 52.372]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false); // Control visibility of suggestions for start location
  const [isDestinationSuggestionsVisible, setIsDestinationSuggestionsVisible] = useState(false); // Control visibility for destination

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

      // Fetch weather for the initial location
      fetchWeather(currentCoordinates);

      return () => mapInstance.current?.remove(); // Cleanup on unmount
    }
  }, []);

  const centerMap = (coordinates: [number, number]) => {
    setCurrentCoordinates(coordinates);
    mapInstance.current?.flyTo({ center: coordinates, zoom: 14 });
    fetchWeather(coordinates); // Fetch weather for the new location
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const response = await fetch(
      `https://api.tomtom.com/search/2/search/${encodeURIComponent(searchQuery)}.json?key=sf5ztt5sJtkhzSJsbOpjshC83JAAcVSH`
    );
    const data = await response.json();
    setSearchResults(data.results || []);
    setIsSuggestionsVisible(true); // Show suggestions for starting location
  };

  const fetchWeather = async (coordinates: [number, number], isDestination = false) => {
    const [lon, lat] = coordinates;
    const weatherApiKey = '9637ec97cb78922c26f0f754eadfe822'; // Replace with your OpenWeatherMap API key
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`
    );
    const data = await response.json();
    const weatherData = {
      temp: data.main.temp,
      description: data.weather[0].description,
    };

    if (isDestination) {
      setDestinationWeather(weatherData); // Update weather for destination
    } else {
      setWeather(weatherData); // Update weather for current location
    }
  };

  // Handle Destination Search (Fetching Suggestions)
  const handleDestinationSearch = async () => {
    if (!destinationQuery.trim()) return;
    const response = await fetch(
      `https://api.tomtom.com/search/2/search/${encodeURIComponent(destinationQuery)}.json?key=sf5ztt5sJtkhzSJsbOpjshC83JAAcVSH`
    );
    const data = await response.json();
    setSearchResults(data.results || []);
    setIsDestinationSuggestionsVisible(true); // Show suggestions for destination
  };

  const handleSearchSelect = (result: tt.SearchResult) => {
    const coordinates: [number, number] = [result.position.lon, result.position.lat];
    setCurrentCoordinates(coordinates);
    centerMap(coordinates);
    setSearchQuery(result.poi?.name || result.address.freeformAddress);
    setIsSuggestionsVisible(false); // Hide suggestions after selection
    fetchWeather(coordinates); // Fetch weather for the new starting point
  };

  const handleDestinationSelect = (result: tt.SearchResult) => {
    const coordinates: [number, number] = [result.position.lon, result.position.lat];
    setDestinationCoordinates(coordinates);
    setIsRouteReady(true); // Enable the "Start Navigation" button
    setDestinationQuery(result.poi?.name || result.address.freeformAddress);
    setIsDestinationSuggestionsVisible(false); // Hide suggestions after selection
    mapInstance.current?.flyTo({ center: coordinates, zoom: 14 });

    // Fetch weather for destination
    fetchWeather(coordinates, true); // true means it's for the destination
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
      alert('Please select a destination.');
      return;
    }

    // Clear any previous routes
    clearPreviousRoute();

    // Fetch new route
    const response = await fetch(
      `https://api.tomtom.com/routing/1/calculateRoute/${currentCoordinates[1]},${currentCoordinates[0]}:${destinationCoordinates[1]},${destinationCoordinates[0]}/json?key=sf5ztt5sJtkhzSJsbOpjshC83JAAcVSH&travelMode=car`
    );
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

    // Add new route to the map
    mapInstance.current?.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geoJson,
      },
      paint: {
        'line-color': '#00ff00',
        'line-width': 5,
      },
    });

    // Center the map on the new route
    const bounds = new tt.LngLatBounds();
    data.routes[0].legs[0].points.forEach((point: any) => {
      bounds.extend([point.longitude, point.latitude]);
    });
    mapInstance.current?.fitBounds(bounds, { padding: 20 });
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <Navigation onBack={onBack} title="Interactive Maps" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className="md:col-span-3 neon-card bg-black/50 p-6 rounded-xl"
            style={{ minHeight: '500px' }}
          >
            <div
              ref={mapElement}
              className="w-full h-full border border-green-500/30 rounded-lg"
            />
          </div>

          <div className="space-y-6">
            {/* Step 1: Search Bar for Starting Location */}
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <Search className="w-6 h-6 text-green-400" />
                Search for Starting Location
              </h3>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                placeholder="Enter starting location..."
                className="w-full p-3 mb-3 border border-green-500/30 rounded-lg bg-black text-gray-300 focus:ring"
              />
              <ul className={`mt-4 space-y-2 ${isSuggestionsVisible ? '' : 'hidden'}`}>
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    onClick={() => handleSearchSelect(result)}
                    className="p-2 border border-green-500/30 rounded-lg hover:bg-green-500/10 cursor-pointer text-gray-300"
                  >
                    {result.poi?.name || result.address.freeformAddress}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 2: Search Bar for Destination Location */}
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-green-400" />
                Search for Destination
              </h3>
              <input
                ref={destinationRef}
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                onKeyUp={handleDestinationSearch}
                placeholder="Enter destination location..."
                className="w-full p-3 mb-3 border border-green-500/30 rounded-lg bg-black text-gray-300 focus:ring"
              />
              <ul
                className={`mt-4 space-y-2 ${isDestinationSuggestionsVisible ? '' : 'hidden'}`}
              >
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    onClick={() => handleDestinationSelect(result)}
                    className="p-2 border border-green-500/30 rounded-lg hover:bg-green-500/10 cursor-pointer text-gray-300"
                  >
                    {result.poi?.name || result.address.freeformAddress}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3: Start Navigation Button */}
            {isRouteReady && (
              <div className="neon-card bg-black/50 p-6 rounded-xl">
                <button
                  onClick={calculateRoute}
                  className="w-full p-3 bg-green-500 text-white rounded-lg"
                >
                  Start Navigation
                </button>
              </div>
            )}

            {/* Weather Info */}
            <div className="neon-card bg-black/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">
                <Sun className="w-6 h-6 text-green-400" />
                Weather Info
              </h3>
              {weather ? (
                <div>
                  <p className="text-gray-300">Temperature: {weather.temp}°C</p>
                  <p className="text-gray-300">Description: {weather.description}</p>
                </div>
              ) : (
                <p className="text-gray-300">Loading weather...</p>
              )}
              {destinationWeather && (
                <div className="mt-4">
                  <h4 className="text-lg font-bold text-gray-300">Destination Weather</h4>
                  <p className="text-gray-300">Temperature: {destinationWeather.temp}°C</p>
                  <p className="text-gray-300">Description: {destinationWeather.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
