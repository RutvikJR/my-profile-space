import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../../utils/LocalStorage";

const counterSlice = createSlice({
  name: "Categories",
  initialState: {
    count: getLocalStorage("count") ? getLocalStorage("count") : 0,
  },
  reducers: {
    setCount: (state, action: PayloadAction<number>) => {
      setLocalStorage("count", action.payload);

      state.count = action.payload;
    },
  },
});

export const { setCount } = counterSlice.actions;

export default counterSlice.reducer;
