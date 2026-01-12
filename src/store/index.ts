import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { BUILD_ENV } from "../constants/build-env";
import rootSaga from "./sagas";
import rootReducer from "./slices";

/** Below the store has been created with these options:
 * - The slice reducers were automatically passed to combineReducers()
 * - redux-saga were added as middleware
 * - The Redux DevTools Extension is disabled for production
 * - This should not include applyMiddleware() or the Redux DevTools Extension composeWithDevTools,
 *   as those are already handled by configureStore
 */

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.REACT_APP_ENV !== BUILD_ENV.PRODUCTION,
});

sagaMiddleware.run(rootSaga);

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default () => {
  const persistor = persistStore(store);
  return { store, persistor };
};
