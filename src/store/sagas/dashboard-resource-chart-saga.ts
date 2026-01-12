import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { DASHBOARD_REQUESTS } from "../request-types";
import {
  toggleGetDashboardResourceChartFailure,
  toggleGetDashboardResourceChartSuccess,
} from "../slices/features/resource-chart-reducer";

const authService = new AppService();

function* fetchDashboardResourceChart(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchDashboarResourceChartData,
      baseUrl,
      data
    );

    yield put(toggleGetDashboardResourceChartSuccess({ ...response }));

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
      toggleGetDashboardResourceChartFailure({ statusCode, statusText })
    );
  }
}

export function* watchGetDashboardResourceChart() {
  yield takeLatest(
    DASHBOARD_REQUESTS.GET_DASHBOARD_RESOURCES_REQUEST,
    fetchDashboardResourceChart
  );
}
