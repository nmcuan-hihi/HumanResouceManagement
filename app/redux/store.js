import { configureStore } from "@reduxjs/toolkit";
import congTyReducer from "./slices/ctySlice";

 const store = configureStore({
  reducer: {
    congTy: congTyReducer,
  },
});
export {store};
