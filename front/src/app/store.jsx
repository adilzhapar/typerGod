import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';
import wpmReducer from '../features/wpmSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    wpm: wpmReducer,
  },
})