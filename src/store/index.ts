import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { moviesApi } from '../services/moviesApi';
import moviesReducer from './moviesSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // bunu yüklemiştik
// Eğer AsyncStorage kullanmak istemezsen burada başka bir storage tanımlaman gerekir.

const rootReducer = combineReducers({
  [moviesApi.reducerPath]: moviesApi.reducer,
  movies: moviesReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['movies'], // sadece arama filtresini sakla
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(moviesApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;