import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { VERIFY_TOKEN_REQUEST } from "../request-types";
import {
  toggleVerifyTokenFailure,
  toggleVerifyTokenSuccess,
} from "../slices/features/verify-token-reducer";

const authService = new AppService();

function* fetchVerifyToken(action: any) {
  const { payload } = action;
  const { token, id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;
    const data = {
      token,
    };
    const response: AxiosResponse<any> = yield call(
      authService.fetchVerifyToken,
      baseUrl,
      id,
      data
    );

    yield put(toggleVerifyTokenSuccess({ ...response }));

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

    yield put(toggleVerifyTokenFailure({ statusCode, statusText }));
  }
}

export function* watchVerifyToken() {
  yield takeLatest(
    VERIFY_TOKEN_REQUEST.POST_VERIFY_TOKEN_REQUEST,
    fetchVerifyToken
  );
}
