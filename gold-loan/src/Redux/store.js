// src/Redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import glNoReducer from './GlNoSlice';
import voucherNoReducer from './voucherNoSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import billNumberReducer from './billNumberSlice';
import rateReducer from './rateSlice';

// Combine your reducers
const rootReducer = combineReducers({
    glNo: glNoReducer,
    voucherNo: voucherNoReducer,
    billNumber: billNumberReducer,
    rateSetting: rateReducer,
});

// Configure persist settings
const persistConfig = {
    key: 'root',
    storage,  // Use localStorage to store data
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
    reducer: persistedReducer,

});


export const persistor = persistStore(store);
export default store;
