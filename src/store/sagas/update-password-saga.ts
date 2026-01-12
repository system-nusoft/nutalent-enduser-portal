import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { PASSWORDS_REQUESTS } from "../request-types";
import {
  togglePatchPasswordFailure,
  togglePatchPasswordSuccess,
} from "../slices/features/password-reducer";

const authService = new AppService();

function* fetchUpdatePassword(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchPatchPassword,
      baseUrl,
      data
    );

    yield put(togglePatchPasswordSuccess({ ...response }));

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

    yield put(togglePatchPasswordFailure({ statusCode, statusText }));
  }
}

export function* watchPatchPassword() {
  yield takeLatest(
    PASSWORDS_REQUESTS.PATCH_PASSSWORD_REQUEST,
    fetchUpdatePassword
  );
}
