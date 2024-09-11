import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Container>
        <Switch>
          <Route exact path="/" component={ItineraryForm} />
          <Route path="/itineraries/:id" component={ItineraryDisplay} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
