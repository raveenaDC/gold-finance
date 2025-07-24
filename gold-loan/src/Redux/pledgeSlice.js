import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pledgeNumber: 1, // Start from 1 or any default number
};

const pledgeSlice = createSlice({
    name: "pledge",
    initialState,
    reducers: {
        incrementPledge: (state) => {
            state.pledgeNumber += 1; // Increase pledge number
        },
        // resetPledge: (state) => {
        //   state.pledgeNumber = 1; // Reset to 1 if needed
        // },
    },
});

// export const { incrementPledge, resetPledge } = pledgeSlice.actions;
export const { incrementPledge } = pledgeSlice.actions;
export default pledgeSlice.reducer;
