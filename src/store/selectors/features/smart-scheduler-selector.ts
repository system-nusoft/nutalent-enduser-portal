import { createSelector } from "reselect";

const SmartSchedulerSelector = (state: TReduxState) =>
  state.features.smartScheduler;

export const getSmartSchedulerData = createSelector(
  SmartSchedulerSelector,
  (app) => app.apiStatus.data
);

export const getSmartSchedulerState = createSelector(
  SmartSchedulerSelector,
  (app) => app.state
);

export const getSmartSchedulerLoading = createSelector(
  getSmartSchedulerState,
  (states) => states.isLoading
);