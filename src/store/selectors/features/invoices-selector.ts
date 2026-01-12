import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const invoicesSelector = (state: TReduxState) => state.features.invoices;

export const getBaseUrl = createSelector(
  invoicesSelector,
  (app) => app.baseUrl
);

export const getInvoicesData = createSelector(
  invoicesSelector,
  (app) => app.apiStatus.data
);

export const getInvoicesList = createSelector(
  getInvoicesData,
  (data: any) => data?.items
);
export const getInvoicesMeta = createSelector(
  getInvoicesData,
  (data: any) => data?.meta
);

export const getInvoicesState = createSelector(
  invoicesSelector,
  (app) => app.state
);

export const invoicesLoading = createSelector(
  getInvoicesState,
  (states) => states.isLoading
);
