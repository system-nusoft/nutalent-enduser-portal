import { createSelector } from 'reselect';

/**
 *
 * @param state
 * Implementation of memoized selectors using reselect to get particular data out of store.
 */

const appFeatureSelector = (state: TReduxState) => state.entities.app;

export const getAppData = createSelector(appFeatureSelector, app => app.data);
