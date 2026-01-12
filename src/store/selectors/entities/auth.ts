import { createSelector } from "reselect";
/**
 *
 * @param state
 * Implementation of memoized selectors using reselect to get particular data out of store.
 */

const authEntitySelector = (state: TReduxState) => state?.features?.login;

export const getIsLoggedIn = createSelector(
  authEntitySelector,
  (app) => app?.apiStatus.data
);

export const getUserRole = createSelector(
  getIsLoggedIn,
  (data: any) => data?.role
);
export const getUserImage = createSelector(getIsLoggedIn, (data: any) => data);
