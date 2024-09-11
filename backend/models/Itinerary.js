const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  day: Number,
  name: String,
  description: String,
  location: String,
  time: String,
  cost: Number,
  weather: String,
  latitude: Number,
  longitude: Number,
  rating: Number,
  address: String,
});

const ItinerarySchema = new mongoose.Schema({
  destination: String,
  budget: Number,
  interests: [String],
  tripDuration: Number,
  activities: [ActivitySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
