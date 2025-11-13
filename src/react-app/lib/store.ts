import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import layoutReducer from "./features/layout/layoutSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      layout: layoutReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
