import { createSlice } from "@reduxjs/toolkit";
import { LANGUAGE } from "../../../constants/language";
import { ROUTES } from "../../../constants/navigation-routes";

/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  language: LANGUAGE.ENGLISH,
  baseUrl: process.env.REACT_BASE_URL || "",
  activeScreen: ROUTES.LOGIN,
  greeting: null,
  validationStates: {
    isLoading: false,
    error: null,
  },
};

export const appFeatureSlice = createSlice({
  // A name, used in action types
  name: "app",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleGreeting: (state, action) => {
      state.greeting = action.payload;
    },
    toggleLoading: (state) => {
      state.validationStates.isLoading = true;
    },
    changeLanguage: (state, action) => {
      state.activeScreen = action.payload;
    },
    updateActiveScreen: (state, action) => {
      state.language = action.payload;
    },
  },
  // A "builder callback" function used to add more reducers
  extraReducers: () => {},
});

export const {
  changeLanguage,
  toggleLoading,
  updateActiveScreen,
  toggleGreeting,
} = appFeatureSlice.actions;
export const appFeatureReducer = appFeatureSlice.reducer;
