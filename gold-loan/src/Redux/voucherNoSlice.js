// src/Redux/voucherNoSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    voucherNo: 1, // Initial voucher number
    lastResetDate: null, // Track the last date it was reset to avoid multiple resets on the same day
};

const voucherNoSlice = createSlice({
    name: 'voucherNo',
    initialState,
    reducers: {
        incrementVoucherNo: (state) => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // April is month 4
            const currentDay = currentDate.getDate();

            // Check if today is April 1st and hasn't been reset yet this year
            if (
                currentMonth === 4 &&
                currentDay === 1 &&
                state.lastResetDate !== `${currentYear}-04-01`
            ) {
                state.voucherNo = 1; // Reset voucher number on April 1st
                state.lastResetDate = `${currentYear}-04-01`; // Update last reset date to avoid multiple resets
            } else {
                state.voucherNo += 1; // Increment voucher number otherwise
            }
        },
    },
});

export const { incrementVoucherNo } = voucherNoSlice.actions;
export default voucherNoSlice.reducer;
