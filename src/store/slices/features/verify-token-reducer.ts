import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  baseUrl: process.env.REACT_BASE_URL || "",
  state: {
    isLoading: false,
    error: null,
  },
  apiStatus: {
    statusCode: null,
    statusText: null,
    data: null,
  },
};

export const verifyTokenFeatureSlice = createSlice({
  // A name, used in action types
  name: "verifyToken",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleVerifyToken: (state) => {
      state.state.isLoading = true;
    },
    toggleVerifyTokenSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
        data: action.payload?.data,
      },
    }),
    toggleVerifyTokenFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: action.payload?.message,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
        data: null,
      },
    }),

    toggleClearVerifyToken: (state) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: null,
        statusText: null,
        data: null,
      },
    }),
  },
  // A "builder callback" function used to add more reducers
});

export const {
  toggleClearVerifyToken,
  toggleVerifyToken,
  toggleVerifyTokenFailure,
  toggleVerifyTokenSuccess,
} = verifyTokenFeatureSlice.actions;
export const verifyTokenFeatureReducer = verifyTokenFeatureSlice.reducer;
