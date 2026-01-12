import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const timelineSelector = (state: TReduxState) => state.features.timelineChart;

export const getBaseUrl = createSelector(
  timelineSelector,
  (app) => app.baseUrl
);

export const getTimelineData = createSelector(
  timelineSelector,
  (app) => app.apiStatus.data
);

export const getTimelineState = createSelector(
  timelineSelector,
  (app) => app.state
);

export const TimelineLoading = createSelector(
  getTimelineState,
  (states) => states.isLoading
);
