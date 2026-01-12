import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { TIMESHEET_REQUESTS } from "../request-types";
import {
  toggleGetDashboardTimesheetListingFailure,
  toggleGetDashboardTimesheetListingSuccess,
} from "../slices/features/timesheet-reducer";

const authService = new AppService();

function* fetchDashboardTimesheet(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchDashboardTimesheetData,
      baseUrl,
      id,
      data
    );

    yield put(toggleGetDashboardTimesheetListingSuccess({ ...response }));

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

    yield put(
      toggleGetDashboardTimesheetListingFailure({ statusCode, statusText })
    );
  }
}

export function* watchGetDashboardTimesheet() {
  yield takeLatest(
    TIMESHEET_REQUESTS.GET_DASHBOARD_TIMESHEET_REQUEST,
    fetchDashboardTimesheet
  );
}
