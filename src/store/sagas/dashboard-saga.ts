import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { DASHBOARD_REQUESTS } from "../request-types";
import {
  toggleGetDashboardFailure,
  toggleGetDashboardSuccess,
} from "../slices/features/dashboard-reducer";

const authService = new AppService();

function* fetchDashboardData(action: any) {
  const { payload } = action;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchDashboardData,
      baseUrl
    );

    yield put(toggleGetDashboardSuccess({ ...response }));

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

    yield put(toggleGetDashboardFailure({ statusCode, statusText }));
  }
}

export function* watchGetDashboardData() {
  yield takeLatest(
    DASHBOARD_REQUESTS.GET_DASHBOARD_REQUEST,
    fetchDashboardData
  );
}
