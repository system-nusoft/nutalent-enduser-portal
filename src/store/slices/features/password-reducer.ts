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

export const passwordFeatureSlice = createSlice({
  // A name, used in action types
  name: "password",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    togglePatchPassword: (state) => {
      state.state.isLoading = true;
    },
    togglePatchPasswordSuccess: (state, action) => ({
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
    togglePatchPasswordFailure: (state, action) => ({
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
    toggleForgotPassword: (state) => {
      state.state.isLoading = true;
    },
    toggleForgotPasswordSuccess: (state, action) => ({
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
    toggleForgotPasswordFailure: (state, action) => ({
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
    toggleResetPassword: (state) => {
      state.state.isLoading = true;
    },
    toggleResetPasswordSuccess: (state, action) => ({
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
    toggleResetPasswordFailure: (state, action) => ({
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
    toggleClearPassword: (state) => ({
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
  toggleClearPassword,
  togglePatchPassword,
  togglePatchPasswordFailure,
  togglePatchPasswordSuccess,
  toggleForgotPassword,
  toggleForgotPasswordFailure,
  toggleForgotPasswordSuccess,
  toggleResetPassword,
  toggleResetPasswordFailure,
  toggleResetPasswordSuccess,
} = passwordFeatureSlice.actions;
export const passwordFeatureReducer = passwordFeatureSlice.reducer;
