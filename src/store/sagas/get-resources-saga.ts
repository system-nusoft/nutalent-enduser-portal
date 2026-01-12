import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { RESOURCES_REQUESTS } from "../request-types";
import {
  toggleGetResourcesFailure,
  toggleGetResourcesSuccess,
} from "../slices/features/resources";

const authService = new AppService();

function* fetchGetResources(action: any) {
  const { payload } = action;
  const { query } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetResourcesData,
      baseUrl,
      query
    );

    yield put(toggleGetResourcesSuccess({ ...response }));

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

    yield put(toggleGetResourcesFailure({ statusCode, statusText }));
  }
}

export function* watchGetResources() {
  yield takeLatest(RESOURCES_REQUESTS.GET_RESOURCES_REQUEST, fetchGetResources);
}
