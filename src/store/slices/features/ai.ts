import { createSlice } from "@reduxjs/toolkit";

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

export const aiFeatureSlice = createSlice({
  name: "ai",
  initialState: INITIAL_STATE,
  reducers: {
    toggleIdentifyRolesWithPricing: {
      reducer: (state) => {
        state.state.isLoading = true;
      },
      prepare: (payload: any) => ({ payload }),
    },
    toggleIdentifyRolesWithPricingSuccess: (state, action) => ({
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
    toggleIdentifyRolesWithPricingFailure: (state, action) => ({
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
    resetAiState: () => INITIAL_STATE,
  },
});

export const {
  toggleIdentifyRolesWithPricing,
  toggleIdentifyRolesWithPricingSuccess,
  toggleIdentifyRolesWithPricingFailure,
  resetAiState,
} = aiFeatureSlice.actions;

export default aiFeatureSlice.reducer;
