import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  baseUrl: process.env.REACT_BASE_URL || "",
  loginState: {
    isLoading: false,
    error: null,
  },
  apiStatus: {
    statusCode: null,
    statusText: null,
    data: null,
  },
};

export const authFeatureSlice = createSlice({
  // A name, used in action types
  name: "authentication",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleLogin: (state) => {
      state.loginState.isLoading = true;
    },
    toggleLoginSuccess: (state, action) => ({
      ...state,
      loginState: {
        ...state.loginState,
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
    toggleLoginFailure: (state, action) => ({
      ...state,
      loginState: {
        ...state.loginState,
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
    toggleClearLogin: (state) => ({
      ...state,
      loginState: {
        ...state.loginState,
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
  toggleLogin,
  toggleLoginFailure,
  toggleLoginSuccess,
  toggleClearLogin,
} = authFeatureSlice.actions;
export const authFeatureReducer = authFeatureSlice.reducer;
