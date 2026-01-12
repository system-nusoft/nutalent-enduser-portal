import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  baseUrl: process.env.REACT_BASE_URL || "",
  state: {
    isLoading: false,
    error: null,
  },
  apiStatus: {
    statusCode: null,
    statusText: null,
    data: null,
  },
  newMessage: null,
};

export const messagesFeatureSlice = createSlice({
  // A name, used in action types
  name: "messages",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleGetMessages: (state) => {
      state.state.isLoading = true;
    },
    toggleGetMessagesSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
        data: action.payload?.data,
      },
    }),
    toggleGetMessagesFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: action.payload?.message,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
        data: null,
      },
    }),
    togglePostMessage: (state) => {
      state.state.isLoading = true;
    },
    togglePostMessageSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    togglePostMessageFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: action.payload?.message,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    toggleReadMessage: (state) => {
      state.state.isLoading = true;
    },
    toggleReadMessageSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    toggleReadMessageFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: action.payload?.message,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    toggleUpdateMessages: (state, action) => ({
      ...state,
      apiStatus: {
        ...state.apiStatus,
        data: action?.payload,
      },
    }),
    toggleNewMessage: (state, action) => ({
      ...state,
      newMessage: action.payload,
    }),
    toggleClearMessages: (state) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: null,
        statusText: null,
        data: null,
      },
    }),
  },
  // A "builder callback" function used to add more reducers
});

export const {
  toggleClearMessages,
  toggleGetMessages,
  toggleGetMessagesFailure,
  toggleGetMessagesSuccess,
  togglePostMessage,
  togglePostMessageFailure,
  togglePostMessageSuccess,
  toggleReadMessage,
  toggleReadMessageFailure,
  toggleReadMessageSuccess,
  toggleUpdateMessages,
  toggleNewMessage,
} = messagesFeatureSlice.actions;
export const messagesFeatureReducer = messagesFeatureSlice.reducer;
