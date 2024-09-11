const express = require('express');
const { createItinerary, getItinerary, updateItinerary, deleteItinerary } = require('../controllers/itineraryController');

const router = express.Router();

router.post('/', createItinerary);
router.get('/:id', getItinerary);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);

module.exports = router;
