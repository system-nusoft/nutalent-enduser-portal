import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { PROJECT_REQUESTS } from "../request-types";
import {
  toggleGetProjectFailure,
  toggleGetProjectSuccess,
} from "../slices/features/project";

const authService = new AppService();

function* fetchGetProject(action: any) {
  const { payload } = action;
  const { query } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetProjectData,
      baseUrl,
      query
    );

    yield put(toggleGetProjectSuccess({ ...response }));

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

    yield put(toggleGetProjectFailure({ statusCode, statusText }));
  }
}

export function* watchGetProject() {
  yield takeLatest(PROJECT_REQUESTS.GET_PROJECT_REQUEST, fetchGetProject);
}
