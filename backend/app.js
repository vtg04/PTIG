const express = require('express');
const cors = require('cors');
const itineraryRoutes = require('./routes/itineraryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/itineraries', itineraryRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

module.exports = app;
