import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { CONFIGURATIONS_REQUESTS } from "../request-types";
import {
  toggleGetConfigurationsFailure,
  toggleGetConfigurationsSuccess,
} from "../slices/features/configuration-reducer";

const authService = new AppService();

function* fetchGetConfiguration(action: any) {
  const { payload } = action;
  const { id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetConfiguration,
      baseUrl,
      id
    );

    yield put(toggleGetConfigurationsSuccess({ ...response }));

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

    yield put(toggleGetConfigurationsFailure({ statusCode, statusText }));
  }
}

export function* watchGetConfiguration() {
  yield takeLatest(
    CONFIGURATIONS_REQUESTS.GET_CONFIGURATIONS_REQUEST,
    fetchGetConfiguration
  );
}
