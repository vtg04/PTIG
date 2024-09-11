import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const Map = ({ destination, activities }) => {
  const [directions, setDirections] = React.useState(null);

  const center = {
    lat: -3.745,
    lng: -38.523
  };

  const origin = activities[0]?.location;
  const waypoints = activities.slice(1, -1).map(activity => ({
    location: activity.location,
    stopover: true,
  }));
  const destinationLocation = activities[activities.length - 1]?.location;

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
      } else {
        console.error('Directions request failed due to ' + response.status);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {origin && destinationLocation && (
          <DirectionsService
            options={{
              origin: origin,
              destination: destinationLocation,
              waypoints: waypoints,
              travelMode: 'DRIVING',
            }}
            callback={directionsCallback}
          />
        )}
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions
            }}
          />
        )}
        {activities.map((activity, index) => (
          <Marker key={index} position={{ lat: activity.lat, lng: activity.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default React.memo(Map);
