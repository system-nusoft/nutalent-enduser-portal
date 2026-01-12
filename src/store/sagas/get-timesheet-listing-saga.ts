import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { TIMESHEET_REQUESTS } from "../request-types";
import {
  toggleGetTimesheetListingFailure,
  toggleGetTimesheetListingSuccess,
} from "../slices/features/timesheet-reducer";

const appService = new AppService();

function* getTimesheetListingSaga(action: any) {
  const { payload } = action;
  const { query, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;
    const response: AxiosResponse<any> = yield call(
      appService.fetchGetTimesheetListing,
      baseUrl,
      query,
      id
    );

    yield put(toggleGetTimesheetListingSuccess({ ...response }));

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

    yield put(toggleGetTimesheetListingFailure({ statusCode, statusText }));
  }
}

export function* watchGetTimesheetListing() {
  yield takeLatest(
    TIMESHEET_REQUESTS.GET_TIMESHEET_REQUEST,
    getTimesheetListingSaga
  );
}
