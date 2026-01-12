import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { INVOICES_REQUESTS } from "../request-types";
import {
  togglePatchInvoiceFailure,
  togglePatchInvoiceSuccess,
} from "../slices/features/invoices-reducer";

const authService = new AppService();

function* fetchPatchInvoice(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchPatchInvoice,
      baseUrl,
      data,
      id
    );

    yield put(togglePatchInvoiceSuccess({ ...response }));

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

    yield put(togglePatchInvoiceFailure({ statusCode, statusText }));
  }
}

export function* watchPatchInvoice() {
  yield takeLatest(INVOICES_REQUESTS.PATCH_INVOICE_REQUEST, fetchPatchInvoice);
}
