import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const InterviewDetailsSelector = (state: TReduxState) =>
  state.features.interviewDetails;

export const getBaseUrl = createSelector(
  InterviewDetailsSelector,
  (app) => app.baseUrl
);

export const getInterviewDetailsData = createSelector(
  InterviewDetailsSelector,
  (app) => app.apiStatus.data
);

export const getInterviewDetailsState = createSelector(
  InterviewDetailsSelector,
  (app) => app.state
);

export const getInterviewDetailsLoading = createSelector(
  getInterviewDetailsState,
  (states) => states.isLoading
);
