import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const authenticationSelector = (state: TReduxState) => state.features.login;

export const getBaseUrl = createSelector(
  authenticationSelector,
  (app) => app.baseUrl
);

export const getLoginData = createSelector(
  authenticationSelector,
  (app) => app.apiStatus.data
);

export const getUsername = createSelector(
  getLoginData,
  (data: any) => data?.name
);
export const getUserId = createSelector(
  getLoginData,
  (data: any) => data?.userId
);

export const getLoginState = createSelector(
  authenticationSelector,
  (app) => app.loginState
);

export const loginLoading = createSelector(
  getLoginState,
  (states) => states.isLoading
);
