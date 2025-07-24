// src/Redux/GlNoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const currentYear = new Date().getFullYear();
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

const initialState = {
    glNo: localStorage.getItem('glNo') || `${currentYear}/001`, // Default format when the form opens
};

const GlNoSlice = createSlice({
    name: 'glNo',
    initialState,
    reducers: {
        incrementGLNo: (state) => {
            const [year, num] = state.glNo.split('/');
            const newNumber = String(parseInt(num) + 1).padStart(3, '0');

            const newGLNo = `${year}/${newNumber}`
            state.glNo = newGLNo;
            localStorage.setItem('glNo', newGLNo);

        },
    },
});

export const { incrementGLNo, } = GlNoSlice.actions;
export default GlNoSlice.reducer;
