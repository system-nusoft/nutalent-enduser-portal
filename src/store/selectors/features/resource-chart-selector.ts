import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const resourceChartSelector = (state: TReduxState) =>
  state.features.resourceChart;

export const getBaseUrl = createSelector(
  resourceChartSelector,
  (app) => app.baseUrl
);

export const getResourceChartData = createSelector(
  resourceChartSelector,
  (app) => app.apiStatus.data
);

export const getResourceChartState = createSelector(
  resourceChartSelector,
  (app) => app.state
);

export const ResourceChartLoading = createSelector(
  getResourceChartState,
  (states) => states.isLoading
);
