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

export const elasticSearchFeatureSlice = createSlice({
  // A name, used in action types
  name: "elasticSearch",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleGetElasticSearch: (state) => {
      state.state.isLoading = true;
    },
    toggleGetElasticSearchSuccess: (state, action) => ({
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
    toggleGetElasticSearchFailure: (state, action) => ({
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
    togglePostJDElasticSearch: (state) => {
      state.state.isLoading = true;
    },
    togglePostJDElasticSearchSuccess: (state, action) => ({
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
      },
    }),
    togglePostJDElasticSearchFailure: (state, action) => ({
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
      },
    }),
    toggleUpdateElasticSearch: (state, action) => ({
      ...state,
      apiStatus: {
        ...state.apiStatus,
        data: action?.payload,
      },
    }),
    toggleClearElasticSearch: (state) => ({
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
  toggleClearElasticSearch,
  toggleGetElasticSearch,
  toggleGetElasticSearchFailure,
  toggleGetElasticSearchSuccess,
  togglePostJDElasticSearch,
  togglePostJDElasticSearchFailure,
  togglePostJDElasticSearchSuccess,
  toggleUpdateElasticSearch,
} = elasticSearchFeatureSlice.actions;
export const elasticSearchFeatureReducer = elasticSearchFeatureSlice.reducer;
