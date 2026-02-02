// state/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { learningApi } from './learningApi';  
import { setupListeners } from '@reduxjs/toolkit/query';
import { chatApi } from './chatApi';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [learningApi.reducerPath]: learningApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(api.middleware)
      .concat(chatApi.middleware)
      .concat(learningApi.middleware),

});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;