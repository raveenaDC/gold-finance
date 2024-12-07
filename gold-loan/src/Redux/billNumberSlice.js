// src/redux/billNumberSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    billNumber: 1, // Starting value
};

const billNumberSlice = createSlice({
    name: 'billNumber',
    initialState,
    reducers: {
        incrementBillNumber(state) {
            state.billNumber += 1; // Increment the bill number
        },
    },
});

export const { incrementBillNumber } = billNumberSlice.actions;
export default billNumberSlice.reducer;
