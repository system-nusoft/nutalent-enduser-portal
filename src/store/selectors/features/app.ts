import { createSelector } from "reselect";

/**
 *
 * @param state
 * Implementation of memoized selectors using reselect to get particular data out of store.
 */

const appFeatureSelector = (state: TReduxState) => state.features.app;

export const getAppActiveScreen = createSelector(
  appFeatureSelector,
  (app) => app.activeScreen
);

export const getAppLanguage = createSelector(
  appFeatureSelector,
  (app) => app.language
);
export const getGreeting = createSelector(
  appFeatureSelector,
  (app) => app.greeting
);

export const getBaseUrl = createSelector(
  appFeatureSelector,
  (app) => app.baseUrl
);

export const getAppValidationStates = createSelector(
  appFeatureSelector,
  (app) => app.validationStates
);

export const getAppLoadingState = createSelector(
  getAppValidationStates,
  (validationStates) => validationStates.isLoading
);
