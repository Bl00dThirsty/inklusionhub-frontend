// state/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { learningApi } from './learningApi';  
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [learningApi.reducerPath]: learningApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(api.middleware)
      .concat(learningApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;