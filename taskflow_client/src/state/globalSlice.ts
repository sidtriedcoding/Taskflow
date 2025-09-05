// src/state/globalSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  isDarkMode: boolean;
}

const initialState: GlobalState = {
  isDarkMode: false, // Default to light mode
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
