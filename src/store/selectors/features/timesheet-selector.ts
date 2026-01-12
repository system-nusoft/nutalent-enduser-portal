import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const timesheetSelector = (state: TReduxState) => state.features.timesheet;

export const getBaseUrl = createSelector(
  timesheetSelector,
  (app) => app.baseUrl
);
export const getTimesheetData = createSelector(
  timesheetSelector,
  (app) => app.apiStatus.data
);

export const getTimesheetList = createSelector(
  getTimesheetData,
  (data: any) => data?.items
);
export const gettimesheetMeta = createSelector(
  getTimesheetData,
  (data: any) => data?.meta
);

export const getTimesheetState = createSelector(
  timesheetSelector,
  (app) => app.state
);

export const timesheetLoading = createSelector(
  getTimesheetState,
  (states) => states.isLoading
);
