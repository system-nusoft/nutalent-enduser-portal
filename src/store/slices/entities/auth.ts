import { createSlice } from "@reduxjs/toolkit";

/**
 * An example of creating entity slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  data: null,
};

export const authEntitySlice = createSlice({
  // A name, used in action types
  name: "auth",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    resetAppData: (state) => {
      state.data = null;
    },
  },
  // A "builder callback" function used to add more reducers
  extraReducers: () => {},
});

export const authEntityReducer = authEntitySlice.reducer;
