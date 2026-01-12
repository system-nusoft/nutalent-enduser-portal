import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const timeZoneSelector = (state: TReduxState) => state.features.timeZone;

export const getBaseUrl = createSelector(
  timeZoneSelector,
  (app) => app.baseUrl
);

export const getTimeZoneData = createSelector(
  timeZoneSelector,
  (app) => app.apiStatus.data
);

export const getTimeZoneState = createSelector(
  timeZoneSelector,
  (app) => app.state
);

export const getTimeZoneLoading = createSelector(
  getTimeZoneState,
  (states) => states.isLoading
);
