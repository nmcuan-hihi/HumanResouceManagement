import { configureStore } from "@reduxjs/toolkit";
import congTyReducer from "./slices/ctySlice";

export const store = configureStore({
  reducer: {
    congTy: congTyReducer,
  },
});
