import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const dashboardSelector = (state: TReduxState) => state.features.dashboard;

export const getBaseUrl = createSelector(
  dashboardSelector,
  (app) => app.baseUrl
);

export const getDashboardData = createSelector(
  dashboardSelector,
  (app) => app.apiStatus.data
);

export const getDashboardState = createSelector(
  dashboardSelector,
  (app) => app.state
);

export const dashboardLoading = createSelector(
  getDashboardState,
  (states) => states.isLoading
);
