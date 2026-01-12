import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const configurationSelector = (state: TReduxState) =>
  state.features.configuration;

export const getBaseUrl = createSelector(
  configurationSelector,
  (app) => app.baseUrl
);

export const getConfigurationData = createSelector(
  configurationSelector,
  (app) => app.apiStatus.data
);

export const getConfigurationState = createSelector(
  configurationSelector,
  (app) => app.state
);

export const configurationLoading = createSelector(
  getConfigurationState,
  (states) => states.isLoading
);
