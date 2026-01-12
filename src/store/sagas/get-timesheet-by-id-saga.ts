import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { TIMESHEET_REQUESTS } from "../request-types";
import {
  toggleGetTimesheetByIdFailure,
  toggleGetTimesheetByIdSuccess,
} from "../slices/features/timesheet-reducer";

const appService = new AppService();

function* getTimesheetByIdSaga(action: any) {
  const { payload } = action;
  const { query, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;
    const response: AxiosResponse<any> = yield call(
      appService.fetchGetTimesheetById,
      baseUrl,
      query,
      id
    );

    yield put(toggleGetTimesheetByIdSuccess({ ...response }));

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

    yield put(toggleGetTimesheetByIdFailure({ statusCode, statusText }));
  }
}

export function* watchGetTimesheetById() {
  yield takeLatest(
    TIMESHEET_REQUESTS.GET_TIMESHEET_BY_ID_REQUEST,
    getTimesheetByIdSaga
  );
}
