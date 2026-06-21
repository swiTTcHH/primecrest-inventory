// src/app/rootReducer.ts
import { combineReducers, AnyAction } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import cartReducer from './slice/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Combine reducers
const appReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer
});

// Root reducer with logout reset
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: AnyAction) => {
  if (action.type === 'LOGOUT') {
    AsyncStorage.removeItem('persist:root');
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
