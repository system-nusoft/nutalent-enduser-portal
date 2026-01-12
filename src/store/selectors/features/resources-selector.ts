import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const resourcesSelector = (state: TReduxState) => state.features.resources;

export const getBaseUrl = createSelector(
  resourcesSelector,
  (app) => app.baseUrl
);

export const getResourcesData = createSelector(
  resourcesSelector,
  (app) => app.apiStatus.data
);

export const getResroucesList = createSelector(
  getResourcesData,
  (data: any) => data?.items
);
export const getResroucesMeta = createSelector(
  getResourcesData,
  (data: any) => data?.meta
);

export const getResourcesState = createSelector(
  resourcesSelector,
  (app) => app.state
);

export const resourcesLoading = createSelector(
  getResourcesState,
  (states) => states.isLoading
);
