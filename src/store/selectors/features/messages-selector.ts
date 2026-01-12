import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const resourcesSelector = (state: TReduxState) => state.features.messages;

export const getBaseUrl = createSelector(
  resourcesSelector,
  (app) => app.baseUrl
);

export const getMessagesData = createSelector(
  resourcesSelector,
  (app) => app.apiStatus.data
);

export const getMessagesList = createSelector(
  getMessagesData,
  (data: any) => data?.items
);
export const getMessagesMeta = createSelector(
  getMessagesData,
  (data: any) => data?.meta
);
export const getNewMessageData = createSelector(
  resourcesSelector,
  (state) => state.newMessage
);

export const getMessagesState = createSelector(
  resourcesSelector,
  (app) => app.state
);

export const messagesLoading = createSelector(
  getMessagesState,
  (states) => states.isLoading
);
