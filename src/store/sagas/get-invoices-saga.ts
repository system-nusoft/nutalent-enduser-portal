import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { INVOICES_REQUESTS } from "../request-types";
import {
  toggleGetInvoicesListingFailure,
  toggleGetInvoicesListingSuccess,
} from "../slices/features/invoices-reducer";

const authService = new AppService();

function* fetchGetInvoicesList(action: any) {
  const { payload } = action;
  const { query } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetInvoicesList,
      baseUrl,
      query
    );

    yield put(toggleGetInvoicesListingSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response.data });
  } catch (errors: any) {
    const error = errors?.data?.errors || errors;
    const { statusCode, statusText } = error;
    Notification({
      type: "error",
      message: errors?.data?.errors?.message || errors?.data?.message,
    });

    payload?.cbFailure &&
      payload?.cbFailure(
        errors?.data?.errors?.message || errors?.data?.message
      );

    yield put(toggleGetInvoicesListingFailure({ statusCode, statusText }));
  }
}

export function* watchGetInvoicesList() {
  yield takeLatest(
    INVOICES_REQUESTS.GET_INVOICES_REQUEST,
    fetchGetInvoicesList
  );
}
