const Itinerary = require('../models/Itinerary');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Import API Keys from environment variables
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const getAIRecommendations = async (interests, destination) => {
    try {
      // Make an API call to a third-party service or an internal AI model
      const response = await axios.post('https://ai-service-url.com/recommendations', {
        interests,
        destination,
      });
  
      // Parse the AI recommendations from the response
      return response.data.recommendations || [];
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      return [];
    }
  };

// Mapping between user interests and Google Places types
const interestToPlaceType = {
  Culture: 'museum',
  Nature: 'park',
  Adventure: 'amusement_park',
  Relaxation: 'spa',
  Food: 'restaurant',
  Nightlife: 'night_club',
};

// Utility function to shuffle an array
const shuffleArray = (array) => {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Weather fetching utility
const getWeather = async (lat, lng, date) => {
  try {
    // For simplicity, fetching current weather; for forecast, use 'onecall' API
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon: lng,
        units: 'metric', // or 'imperial'
        appid: OPENWEATHER_API_KEY,
      },
    });

    if (weatherResponse.data && weatherResponse.data.weather) {
      return weatherResponse.data.weather[0].description;
    }

    return 'Unknown';
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    return 'Unknown';
  }
};

// Helper function to fetch activities from Google Places
const fetchActivities = async (destination, interests, tripDuration) => {
  try {
    // Step 1: Geocode the destination to get latitude and longitude
    const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: destination,
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    if (geocodeResponse.data.status !== 'OK') {
      throw new Error('Failed to geocode the destination.');
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    // Step 2: For each interest, fetch places
    const activities = [];
    const uniqueActivities = new Set(); // To avoid duplicates

    for (let day = 1; day <= tripDuration; day++) {
      for (const interest of interests) {
        const placeType = interestToPlaceType[interest];
        if (!placeType) continue; // Skip if no mapping exists

        const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
          params: {
            location: `${lat},${lng}`,
            radius: 5000, // 5 km radius; adjust as needed
            type: placeType,
            key: GOOGLE_PLACES_API_KEY,
          },
        });

        if (placesResponse.data.status !== 'OK') {
          console.warn(`No places found for type: ${placeType} on day ${day}`);
          continue;
        }

        // Shuffle the results to add variety
        const shuffledPlaces = shuffleArray(placesResponse.data.results);

        for (const place of shuffledPlaces) {
          if (uniqueActivities.has(place.place_id)) continue; // Skip duplicates

          uniqueActivities.add(place.place_id);

          // Fetch weather for the place
          const weather = await getWeather(place.geometry.location.lat, place.geometry.location.lng, new Date());

          activities.push({
            day,
            name: place.name,
            description: place.vicinity || '',
            location: place.vicinity || destination,
            time: '10:00 AM', // Placeholder; you can enhance to assign different times
            cost: 0, // Google Places API doesn't provide cost; set to 0 or fetch from another source
            weather,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            rating: place.rating || null,
            address: place.vicinity || '',
          });

          break; // Add one activity per interest per day
        }
      }
    }

    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error.message);
    throw error;
  }
};

const createItinerary = async (req, res, next) => {
    try {
      const { destination, budget, interests, tripDuration } = req.body;
  
      const aiRecommendations = await getAIRecommendations(interests, destination);
  
      // Fetch activities based on destination, interests, and trip duration
      let activities = await fetchActivities(destination, interests, tripDuration);
  
      // Combine AI recommendations with other activities
      if (aiRecommendations && aiRecommendations.length > 0) {
        aiRecommendations.forEach((recommendation, index) => {
          activities.push({
            day: index + 1,
            name: recommendation.name,
            description: recommendation.description,
            location: destination,
            time: recommendation.time || '12:00 PM',
            cost: recommendation.cost || 0,
            weather: recommendation.weather || 'Unknown',
          });
        });
      }
  
      const itinerary = new Itinerary({
        destination,
        budget,
        interests,
        tripDuration,
        activities,
      });
  
      await itinerary.save();
      res.status(201).json(itinerary);
    } catch (error) {
      next(error);
    }
  };  

const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

const updateItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.json({ message: 'Itinerary deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
};