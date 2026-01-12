import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { CONFIGURATIONS_REQUESTS } from "../request-types";
import {
  togglePostConfigurationsFailure,
  togglePostConfigurationsSuccess,
} from "../slices/features/configuration-reducer";

const authService = new AppService();

function* fetchPostConfiguration(action: any) {
  const { payload } = action;
  const { id, data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchPostConfiguration,
      baseUrl,
      id,
      data
    );

    yield put(togglePostConfigurationsSuccess({ ...response }));

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

    yield put(togglePostConfigurationsFailure({ statusCode, statusText }));
  }
}

export function* watchPostConfiguration() {
  yield takeLatest(
    CONFIGURATIONS_REQUESTS.POST_CONFIGURATIONS_REQUEST,
    fetchPostConfiguration
  );
}
