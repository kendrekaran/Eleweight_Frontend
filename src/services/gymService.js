import axios from 'axios';

const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY 

/**
 * Fetch nearby gyms based on user location
 * @param {Object} params - Search parameters
 * @param {string} params.latitude - User's latitude
 * @param {string} params.longitude - User's longitude
 * @param {number} params.radius - Search radius in meters (default: 1500)
 * @returns {Promise} - Promise with the API response
 */
export const getNearbyGyms = async ({ latitude, longitude, radius = 1500 }) => {
  try {
    const response = await axios.get(
      `https://maps.gomaps.pro/maps/api/place/nearbysearch/json`,
      {
        params: {
          keyword: 'gym',
          location: `${latitude},${longitude}`,
          name: 'gym',
          radius,
          key: MAPS_API_KEY
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby gyms:', error);
    throw error;
  }
};

export default {
  getNearbyGyms
}; 