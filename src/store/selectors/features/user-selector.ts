import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const UserSelector = (state: TReduxState) => state.features.user;

export const getBaseUrl = createSelector(UserSelector, (app) => app.baseUrl);

export const getUserData = createSelector(
  UserSelector,
  (app) => app.apiStatus.data
);

export const getUserState = createSelector(UserSelector, (app) => app.state);

export const getUserLoading = createSelector(
  getUserState,
  (states) => states.isLoading
);
