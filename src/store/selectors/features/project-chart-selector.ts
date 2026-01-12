import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const projectChartSelector = (state: TReduxState) =>
  state.features.projectChart;

export const getBaseUrl = createSelector(
  projectChartSelector,
  (app) => app.baseUrl
);

export const getProjectChartData = createSelector(
  projectChartSelector,
  (app) => app.apiStatus.data
);

export const getProjectChartState = createSelector(
  projectChartSelector,
  (app) => app.state
);

export const projectChartLoading = createSelector(
  getProjectChartState,
  (states) => states.isLoading
);
