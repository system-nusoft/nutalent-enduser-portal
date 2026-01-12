import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { USER_REQUESTS } from "../request-types";
import {
  togglePostUserFailure,
  togglePostUserSuccess,
} from "../slices/features/user-reducer";

const authService = new AppService();

function* postAccountSetupSaga(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchAccountSetup,
      baseUrl,
      data
    );

    yield put(togglePostUserSuccess({ ...response }));

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

    yield put(togglePostUserFailure({ statusCode, statusText }));
  }
}

export function* watchAccountSetup() {
  yield takeLatest(USER_REQUESTS.POST_USER_REQUSET, postAccountSetupSaga);
}
