// rateSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    date: '',
    goldRate: '',
    companyGoldRate: '',
};

const rateSlice = createSlice({
    name: 'rateSetting',
    initialState,
    reducers: {
        setRateData: (state, action) => {
            const { date, goldRate, companyGoldRate } = action.payload;
            state.date = date;
            state.goldRate = goldRate;
            state.companyGoldRate = companyGoldRate;
        },
    },
});

export const { setRateData } = rateSlice.actions;
export default rateSlice.reducer;
