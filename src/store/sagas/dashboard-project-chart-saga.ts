import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { DASHBOARD_REQUESTS } from "../request-types";
import {
  toggleGetDashboardProjectChartFailure,
  toggleGetDashboardProjectChartSuccess,
} from "../slices/features/project-chart-reducer";

const authService = new AppService();

function* fetchDashboardProjectChart(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchDashboarProjectChartData,
      baseUrl,
      data
    );

    yield put(toggleGetDashboardProjectChartSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response });
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
      toggleGetDashboardProjectChartFailure({ statusCode, statusText })
    );
  }
}

export function* watchGetDashboardProjectChart() {
  yield takeLatest(
    DASHBOARD_REQUESTS.GET_DASHBOARD_PROJECT_REQUEST,
    fetchDashboardProjectChart
  );
}
