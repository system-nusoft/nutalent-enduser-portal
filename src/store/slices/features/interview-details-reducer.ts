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

export const interviewDetailsFeatureSlice = createSlice({
  // A name, used in action types
  name: "interviewDetails",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleGetInterviewDetails: (state) => {
      state.state.isLoading = true;
    },
    toggleGetInterviewDetailsSuccess: (state, action) => ({
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
    toggleGetInterviewDetailsFailure: (state, action) => ({
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
    toggleClearInterviewDetails: (state) => ({
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
  toggleClearInterviewDetails,
  toggleGetInterviewDetails,
  toggleGetInterviewDetailsFailure,
  toggleGetInterviewDetailsSuccess,
} = interviewDetailsFeatureSlice.actions;
export const interviewDetailsFeatureReducer =
  interviewDetailsFeatureSlice.reducer;
