import { configureStore } from '@reduxjs/toolkit';
import meetingsReducer from './meetingsSlice';

export const store = configureStore({
  reducer: {
    meetings: meetingsReducer,
  },
}); 