import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const ItineraryForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    interests: [],
    tripDuration: '',
  });

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const interestsOptions = ['Culture', 'Nature', 'Adventure', 'Relaxation', 'Food', 'Nightlife'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newInterests = checked
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value);
      return { ...prev, interests: newInterests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/itineraries', formData);
      console.log('Itinerary Created:', response.data);
      history.push(`/itineraries/${response.data._id}`);
    } catch (error) {
      console.error('Error creating itinerary:', error);
      alert('Failed to create itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>Create Your Travel Itinerary</Typography>
        <TextField
          label="Destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Budget ($)"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Typography variant="h6" gutterBottom>Interests</Typography>
        <FormGroup row>
          {interestsOptions.map(interest => (
            <FormControlLabel
              key={interest}
              control={
                <Checkbox
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={handleCheckboxChange}
                />
              }
              label={interest}
            />
          ))}
        </FormGroup>
        <TextField
          label="Trip Duration (days)"
          name="tripDuration"
          type="number"
          value={formData.tripDuration}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </Button>
      </form>
    </Box>
  );
};

export default ItineraryForm;