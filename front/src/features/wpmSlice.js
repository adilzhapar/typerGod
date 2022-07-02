import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 0,
}

export const wpmSlice = createSlice({
    name: 'wpm',
    initialState,
    reducers: {
        setWpm: (state, action) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setWpm } = wpmSlice.actions;

export default wpmSlice.reducer;