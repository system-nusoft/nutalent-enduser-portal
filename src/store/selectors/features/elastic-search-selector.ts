import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const elasticSearchSelector = (state: TReduxState) =>
  state.features.elasticSearch;

export const getBaseUrl = createSelector(
  elasticSearchSelector,
  (app) => app.baseUrl
);

export const getElasticSearchData = createSelector(
  elasticSearchSelector,
  (app) => app.apiStatus.data
);

export const getElasticSearchList = createSelector(
  getElasticSearchData,
  (data: any) => data?.items
);
export const getElasticSearchMeta = createSelector(
  getElasticSearchData,
  (data: any) => data?.meta
);

export const getElasticSearchState = createSelector(
  elasticSearchSelector,
  (app) => app.state
);

export const elasticSearchLoading = createSelector(
  getElasticSearchState,
  (states) => states.isLoading
);
