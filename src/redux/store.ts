import { combineReducers, configureStore } from "@reduxjs/toolkit";
import CounterReducer from "./slice/counter";

export const rootReducer = combineReducers({
  counter: CounterReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;
