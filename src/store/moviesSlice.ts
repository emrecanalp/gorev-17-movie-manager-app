import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MoviesState {
  searchTerm: string;
}

const initialState: MoviesState = {
  searchTerm: '',
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSearchTerm } = moviesSlice.actions;
export default moviesSlice.reducer;