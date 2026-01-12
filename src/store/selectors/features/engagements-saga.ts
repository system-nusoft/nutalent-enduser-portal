import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const engagementSelector = (state: TReduxState) => state.features.engagements;

export const getBaseUrl = createSelector(
  engagementSelector,
  (app) => app.baseUrl
);

export const getEngagementData = createSelector(
  engagementSelector,
  (app) => app.apiStatus.data
);

export const getEngagementList = createSelector(
  getEngagementData,
  (data: any) => data?.items
);
export const getEngagementMeta = createSelector(
  getEngagementData,
  (data: any) => data?.meta
);

export const getEngagementState = createSelector(
  engagementSelector,
  (app) => app.state
);

export const getEngagementLoading = createSelector(
  getEngagementState,
  (states) => states.isLoading
);
