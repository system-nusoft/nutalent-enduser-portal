import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const verifyTokenSelector = (state: TReduxState) => state.features.verifyToken;

export const getBaseUrl = createSelector(
  verifyTokenSelector,
  (app) => app.baseUrl
);

export const getVerifyTokenData = createSelector(
  verifyTokenSelector,
  (app) => app.apiStatus.data
);

export const getVerifyTokenState = createSelector(
  verifyTokenSelector,
  (app) => app.state
);

export const verifyTokenLoading = createSelector(
  getVerifyTokenState,
  (states) => states.isLoading
);
