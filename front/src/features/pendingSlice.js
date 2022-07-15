import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 0,
}

export const pendingSlice = createSlice({
    name: 'pending',
    initialState,
    reducers: {
        addPoint: (state, action) => {
            state.value += action.payload;
        },
        setPending: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const {addPoint, setPending} = pendingSlice.actions
export default pendingSlice.reducer
