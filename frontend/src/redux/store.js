import { configureStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import itineraryReducer from './reducers/itineraryReducer';

const rootReducer = combineReducers({
  itinerary: itineraryReducer,
  // Add other reducers here
});

const store = configureStore(rootReducer, applyMiddleware(thunk));

export default store;
