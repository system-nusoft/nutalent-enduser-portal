import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const resourcesSelector = (state: TReduxState) => state.features.resourceById;

export const getBaseUrl = createSelector(
  resourcesSelector,
  (app) => app.baseUrl
);

export const getResourcesByIdData = createSelector(
  resourcesSelector,
  (app) => app.apiStatus.data
);

export const getResroucesList = createSelector(
  getResourcesByIdData,
  (data: any) => data?.items
);

export const getResourcesByIdState = createSelector(
  resourcesSelector,
  (app) => app.state
);

export const resourcesByIdLoading = createSelector(
  getResourcesByIdState,
  (states) => states.isLoading
);
