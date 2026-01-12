import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { USER_REQUESTS } from "../request-types";
import {
  toggleGetUserFailure,
  toggleGetUserSuccess,
} from "../slices/features/user-reducer";

const authService = new AppService();

function* fetchGetUser(action: any) {
  const { payload } = action;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetUser,
      baseUrl
    );

    yield put(toggleGetUserSuccess({ ...response }));

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

    yield put(toggleGetUserFailure({ statusCode, statusText }));
  }
}

export function* watchGetUser() {
  yield takeLatest(USER_REQUESTS.GET_USER_REQUEST, fetchGetUser);
}
