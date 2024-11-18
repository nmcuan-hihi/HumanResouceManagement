import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phoneNumber: null,
};

// Slice
const ctySlice = createSlice({
  name: "congTy",
  initialState: {
    idCty: null,
  },
  reducers: {
    saveIdCty: (state, action) => {
      state.idCty = action.payload;
    },
  },
});

export const { saveIdCty }=ctySlice.actions;

export default ctySlice.reducer;
