// src/app/configureStore.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger';

import rootReducer from './rootReducer';

const isDev = process.env.NODE_ENV === 'development'

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    })
    return middleware
    // return isDev ? middleware.concat(logger) : middleware
  },
});

// Create a persistor
export const persistor = persistStore(store);
