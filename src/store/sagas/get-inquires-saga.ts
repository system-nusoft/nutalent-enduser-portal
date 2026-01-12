import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { INQUIRES_REQUESTS } from "../request-types";
import {
  toggleGetInquiresFailure,
  toggleGetInquiresSuccess,
} from "../slices/features/inquires-selector";

const authService = new AppService();

function* fetchGetInquires(action: any) {
  const { payload } = action;
  const { query } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetInquires,
      baseUrl,
      query
    );

    yield put(toggleGetInquiresSuccess({ ...response }));

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

    yield put(toggleGetInquiresFailure({ statusCode, statusText }));
  }
}

export function* watchGetInquires() {
  yield takeLatest(INQUIRES_REQUESTS.GET_INQUIRES_REQUEST, fetchGetInquires);
}
