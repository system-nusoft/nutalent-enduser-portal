import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const passwordSelector = (state: TReduxState) => state.features.password;

export const getBaseUrl = createSelector(
  passwordSelector,
  (app) => app.baseUrl
);

export const getPasswordData = createSelector(
  passwordSelector,
  (app) => app.apiStatus.data
);

export const getPasswordState = createSelector(
  passwordSelector,
  (app) => app.state
);

export const passwordLoading = createSelector(
  getPasswordState,
  (states) => states.isLoading
);
