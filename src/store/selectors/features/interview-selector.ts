import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const interviewSelector = (state: TReduxState) => state.features.interview;

export const getBaseUrl = createSelector(
  interviewSelector,
  (app) => app.baseUrl
);

export const getInterviewData = createSelector(
  interviewSelector,
  (app) => app.apiStatus.data
);

export const getInterviewList = createSelector(
  getInterviewData,
  (data: any) => data?.items
);
export const getInterviewMeta = createSelector(
  getInterviewData,
  (data: any) => data?.meta
);

export const getInterviewState = createSelector(
  interviewSelector,
  (app) => app.state
);

export const interviewLoading = createSelector(
  getInterviewState,
  (states) => states.isLoading
);
