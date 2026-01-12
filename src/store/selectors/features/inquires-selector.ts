import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const inquiresSelector = (state: TReduxState) => state.features.inquires;

export const getBaseUrl = createSelector(
  inquiresSelector,
  (app) => app.baseUrl
);

export const getInquiresData = createSelector(
  inquiresSelector,
  (app) => app.apiStatus.data
);

export const getInquiresList = createSelector(
  getInquiresData,
  (data: any) => data?.items
);
export const getInquiresMeta = createSelector(
  getInquiresData,
  (data: any) => data?.meta
);

export const getInquiresState = createSelector(
  inquiresSelector,
  (app) => app.state
);

export const inquiresLoading = createSelector(
  getInquiresState,
  (states) => states.isLoading
);
