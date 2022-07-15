import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: "",
}

export const accountSlice = createSlice({
    name: 'currentAccount',
    initialState,
    reducers: {
        setCurrentAccount: (state, action) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCurrentAccount } = accountSlice.actions;

export default accountSlice.reducer;