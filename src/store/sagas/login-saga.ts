import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { Notification } from "src/components";
import { ROLES } from "src/constants/roles";
import { AuthService } from "src/services/auth";
import { LocalStorageService } from "src/services/local-storage";
import { AUTH_REQUESTS } from "../request-types";
import {
  toggleLoginFailure,
  toggleLoginSuccess,
} from "../slices/features/auth";

const authService = new AuthService();
const localStorageService = new LocalStorageService();

function* fetchLogin(action: any) {
  const { payload } = action;
  const { email, password, t } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const data = {
      username: email,
      password: password,
    };

    const response: AxiosResponse<any> = yield call(
      authService.signIn,
      baseUrl,
      data
    );

    if (response?.data?.role !== ROLES.END_USER) {
      const message = t("error.notAuthorized");
      payload?.cbFailure && payload?.cbFailure(message);
      Notification({ type: "error", message: message });
      yield put(toggleLoginFailure({ statusCode: 500, statusText: message }));
      return new Error(message);
    }

    yield call(
      localStorageService.persist,
      "user",
      JSON.stringify(response?.data)
    );

    yield put(toggleLoginSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess();
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

    yield put(toggleLoginFailure({ statusCode, statusText }));
  }
}

export function* watchLogin() {
  yield takeLatest(AUTH_REQUESTS.LOGIN_REQUEST, fetchLogin);
}
