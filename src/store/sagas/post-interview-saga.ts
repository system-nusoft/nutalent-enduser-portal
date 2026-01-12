import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { INTERVIEW_REQUESTS } from "../request-types";
import {
  togglePostInterviewFailure,
  togglePostInterviewSuccess,
} from "../slices/features/interview-reducer";

const authService = new AppService();

function* fetchPostInterview(action: any) {
  const { payload } = action;
  const { data, id, timeZone } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const reqData = { ...data, timeZone };

    const response: AxiosResponse<any> = yield call(
      authService.fetchScheduleInterview,
      baseUrl,
      reqData,
      id
    );

    yield put(togglePostInterviewSuccess({ ...response }));

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

    yield put(togglePostInterviewFailure({ statusCode, statusText }));
  }
}

export function* watchPostInterview() {
  yield takeLatest(
    INTERVIEW_REQUESTS.POST_INTERVIEW_REQUEST,
    fetchPostInterview
  );
}
