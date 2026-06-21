// src/app/storeTypes.ts
import type { store } from './configureStore';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
