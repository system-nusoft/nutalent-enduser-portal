import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const allEngagementSelector = (state: TReduxState) =>
  state.features.allEngagements;

export const getBaseUrl = createSelector(
  allEngagementSelector,
  (app) => app.baseUrl
);

export const getAllEngagementData = createSelector(
  allEngagementSelector,
  (app) => app.apiStatus.data
);

export const getAllEngagementList = createSelector(
  getAllEngagementData,
  (data: any) => data?.items
);
export const getAllEngagementMeta = createSelector(
  getAllEngagementData,
  (data: any) => data?.meta
);

export const getAllEngagementState = createSelector(
  allEngagementSelector,
  (app) => app.state
);

export const getAllEngagementLoading = createSelector(
  getAllEngagementState,
  (states) => states.isLoading
);
