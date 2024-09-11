import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import Map from './Map'; // Assume you have a Map component

const ItineraryDisplay = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/itineraries/${id}`);
        setItinerary(response.data);
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      }
    };
    fetchItinerary();
  }, [id]);

  if (!itinerary) return <div>Loading...</div>;

  return (
    <div>
      <Typography variant="h4">Your Itinerary for {itinerary.destination}</Typography>
      <Map destination={itinerary.destination} activities={itinerary.activities} />
      <Grid container spacing={2}>
        {itinerary.activities.map(activity => (
          <Grid item xs={12} md={6} key={activity.day}>
            <Card>
              <CardContent>
                <Typography variant="h6">Day {activity.day}: {activity.name}</Typography>
                <Typography>{activity.description}</Typography>
                <Typography>Location: {activity.location}</Typography>
                <Typography>Time: {activity.time}</Typography>
                <Typography>Cost: ${activity.cost}</Typography>
                <Typography>Weather: {activity.weather}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ItineraryDisplay;
