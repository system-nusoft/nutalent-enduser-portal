import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { PASSWORDS_REQUESTS } from "../request-types";
import {
  toggleForgotPasswordFailure,
  toggleForgotPasswordSuccess,
} from "../slices/features/password-reducer";

const authService = new AppService();

function* fetchForgotPassword(action: any) {
  const { payload } = action;
  const { email } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;
    const data = {
      email,
    };
    const response: AxiosResponse<any> = yield call(
      authService.fetchForgotPassword,
      baseUrl,
      data
    );

    yield put(toggleForgotPasswordSuccess({ ...response }));

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

    yield put(toggleForgotPasswordFailure({ statusCode, statusText }));
  }
}

export function* watchForgotPassword() {
  yield takeLatest(
    PASSWORDS_REQUESTS.FORGOT_PASSWORD_REQUEST,
    fetchForgotPassword
  );
}
