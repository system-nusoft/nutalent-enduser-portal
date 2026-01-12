import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { PASSWORDS_REQUESTS } from "../request-types";
import {
  toggleResetPasswordFailure,
  toggleResetPasswordSuccess,
} from "../slices/features/password-reducer";

const authService = new AppService();

function* fetchResetPasswordSaga(action: any) {
  const { payload } = action;
  const { userId, password, token } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;
    const data = {
      password,
      token,
    };
    const response: AxiosResponse<any> = yield call(
      authService.fetchResetPassword,
      baseUrl,
      userId,
      data
    );

    yield put(toggleResetPasswordSuccess({ ...response }));

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

    yield put(toggleResetPasswordFailure({ statusCode, statusText }));
  }
}

export function* watchResetPassword() {
  yield takeLatest(
    PASSWORDS_REQUESTS.RESET_PASSSWORD_REQUEST,
    fetchResetPasswordSaga
  );
}
