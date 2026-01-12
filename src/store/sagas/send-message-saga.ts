import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { MESSAGE_REQUESTS } from "../request-types";
import {
  togglePostMessageFailure,
  togglePostMessageSuccess,
} from "../slices/features/messages-reducer";

const authService = new AppService();

function* fetchPostMessage(action: any) {
  const { payload } = action;
  const { data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchPostMessage,
      baseUrl,
      data
    );

    yield put(togglePostMessageSuccess({ ...response }));

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

    yield put(togglePostMessageFailure({ statusCode, statusText }));
  }
}

export function* watchPostMessages() {
  yield takeLatest(MESSAGE_REQUESTS.POST_MESSAGE_REQUEST, fetchPostMessage);
}
