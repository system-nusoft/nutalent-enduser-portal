import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const projectSelector = (state: TReduxState) => state.features.project;

export const getBaseUrl = createSelector(projectSelector, (app) => app.baseUrl);

export const getProjectData = createSelector(
  projectSelector,
  (app) => app.apiStatus.data
);

export const getProjectList = createSelector(
  getProjectData,
  (data: any) => data?.items
);
export const getProjectListMeta = createSelector(
  getProjectData,
  (data: any) => data?.meta
);

export const getProjectState = createSelector(
  projectSelector,
  (app) => app.state
);

export const projectLoading = createSelector(
  getProjectState,
  (states) => states.isLoading
);
