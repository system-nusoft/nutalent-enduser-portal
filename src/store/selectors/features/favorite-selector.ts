import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const favoriteResourcesSelector = (state: TReduxState) =>
  state.features.favoriteResources;

export const getBaseUrl = createSelector(
  favoriteResourcesSelector,
  (app) => app.baseUrl
);

export const getFavoriteResourcesData = createSelector(
  favoriteResourcesSelector,
  (app) => app.apiStatus.data
);

export const getFavoriteResroucesList = createSelector(
  getFavoriteResourcesData,
  (data: any) => data?.items
);

export const getFavoriteResourcesState = createSelector(
  favoriteResourcesSelector,
  (app) => app.state
);

export const favoriteResourcesLoading = createSelector(
  getFavoriteResourcesState,
  (states) => states.isLoading
);
