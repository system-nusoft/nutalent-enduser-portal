import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { TIMESHEET_REQUESTS } from "../request-types";
import {
  togglePutTimesheetFailure,
  togglePutTimesheetSuccess,
} from "../slices/features/timesheet-reducer";

const appService = new AppService();

function* putTimesheetSaga(action: any) {
  const { payload } = action;
  const { data, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;
    const response: AxiosResponse<any> = yield call(
      appService.fetchPutTimesheet,
      baseUrl,
      data,
      id
    );

    yield put(togglePutTimesheetSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response?.data });
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

    yield put(togglePutTimesheetFailure({ statusCode, statusText }));
  }
}

export function* watchPutTimesheet() {
  yield takeLatest(TIMESHEET_REQUESTS.PUT_TIMESHEET_REQUEST, putTimesheetSaga);
}
