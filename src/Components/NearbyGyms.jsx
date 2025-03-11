import React, { useState, useEffect } from 'react';
import { getNearbyGyms } from '../services/gymService';
import { MapPin, Navigation, Clock, Star, Phone, ExternalLink, Loader2 } from 'lucide-react';

const NearbyGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(1500);

  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            fetchNearbyGyms(latitude, longitude, searchRadius);
          },
          (error) => {
            console.error('Error getting user location:', error);
            setError('Unable to get your location. Please enable location services and try again.');
            setLoading(false);
            // Use default location if user denies permission
            const defaultLocation = { latitude: 18.399251, longitude: 76.556786 };
            setUserLocation(defaultLocation);
            fetchNearbyGyms(defaultLocation.latitude, defaultLocation.longitude, searchRadius);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  // Fetch nearby gyms when radius changes
  useEffect(() => {
    if (userLocation) {
      fetchNearbyGyms(userLocation.latitude, userLocation.longitude, searchRadius);
    }
  }, [searchRadius, userLocation]);

  const fetchNearbyGyms = async (latitude, longitude, radius) => {
    try {
      setLoading(true);
      const data = await getNearbyGyms({ latitude, longitude, radius });
      setGyms(data.results || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch nearby gyms. Please try again later.');
      console.error('Error fetching gyms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    setSearchRadius(Number(e.target.value));
  };

  const getDirectionsUrl = (gym) => {
    if (!gym.geometry || !gym.geometry.location) return '#';
    const { lat, lng } = gym.geometry.location;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800">Find Nearby Gyms</h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          Discover fitness centers in your area to start your workout journey. We use your location to find the closest gyms.
        </p>
        
        <div className="mx-auto mt-6 max-w-md">
          <label htmlFor="radius" className="block mb-1 text-sm font-medium text-gray-700">
            Search Radius: {searchRadius} meters
          </label>
          <input
            type="range"
            id="radius"
            name="radius"
            min="500"
            max="5000"
            step="500"
            value={searchRadius}
            onChange={handleRadiusChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>500m</span>
            <span>5000m</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Finding gyms near you...</span>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && gyms.length === 0 && (
        <div className="py-12 text-center bg-gray-50 rounded-lg">
          <MapPin className="mx-auto mb-4 w-12 h-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No gyms found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try increasing your search radius or check back later.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gyms.map((gym) => (
          <div key={gym.place_id} className="overflow-hidden bg-white rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg">
            {gym.photos && gym.photos[0] ? (
              <div className="flex justify-center items-center h-48 bg-gray-200">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            ) : (
              <div className="flex justify-center items-center h-48 bg-gray-200">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{gym.name}</h3>
                {gym.rating && (
                  <div className="flex items-center px-2 py-1 bg-blue-50 rounded">
                    <Star className="mr-1 w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{gym.rating}</span>
                    {gym.user_ratings_total && (
                      <span className="ml-1 text-xs text-gray-500">({gym.user_ratings_total})</span>
                    )}
                  </div>
                )}
              </div>
              
              {gym.vicinity && (
                <div className="flex items-start mt-3">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{gym.vicinity}</p>
                </div>
              )}
              
              {gym.opening_hours && (
                <div className="flex items-center mt-3">
                  <Clock className="mr-2 w-5 h-5 text-gray-500" />
                  <p className="text-sm">
                    {gym.opening_hours.open_now ? (
                      <span className="font-medium text-green-600">Open now</span>
                    ) : (
                      <span className="font-medium text-red-600">Closed</span>
                    )}
                  </p>
                </div>
              )}
              
              <div className="flex mt-6 space-x-3">
                <a
                  href={getDirectionsUrl(gym)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 justify-center items-center px-4 py-2 text-center text-white bg-blue-600 rounded-lg transition-colors duration-200 hover:bg-blue-700"
                >
                  <Navigation className="mr-2 w-4 h-4" />
                  Directions
                </a>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${gym.geometry.location.lat},${gym.geometry.location.lng}&query_place_id=${gym.place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 justify-center items-center px-4 py-2 text-center text-gray-800 bg-gray-100 rounded-lg transition-colors duration-200 hover:bg-gray-200"
                >
                  <ExternalLink className="mr-2 w-4 h-4" />
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyGyms; 