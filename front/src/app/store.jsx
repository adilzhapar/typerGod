import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';
import wpmReducer from '../features/wpmSlice';
import pendingReducer from '../features/pendingSlice';

export const store = configureStore({
  reducer: {
    pending: pendingReducer,
    counter: counterReducer,
    wpm: wpmReducer,
  },
})