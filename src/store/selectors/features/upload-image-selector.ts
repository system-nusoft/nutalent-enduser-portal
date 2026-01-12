import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getImageSelector = (state: TReduxState) => state.features.image;

export const getBaseUrl = createSelector(
  getImageSelector,
  (app) => app.baseUrl
);

export const getUploadImageData = createSelector(
  getImageSelector,
  (app) => app.apiStatus.data
);

export const getUploadImageState = createSelector(
  getImageSelector,
  (app) => app.state
);

export const getUploadImageLoading = createSelector(
  getUploadImageState,
  (states) => states.isLoading
);
