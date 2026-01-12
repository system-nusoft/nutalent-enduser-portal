import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { INTERVIEW_DETAILS_REQUESTS } from "../request-types";
import {
  toggleGetInterviewDetailsFailure,
  toggleGetInterviewDetailsSuccess,
} from "../slices/features/interview-details-reducer";

const authService = new AppService();

function* fetchGetInterviewDetails(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.getInterviewDetails,
      baseUrl,
      id,
      data
    );

    yield put(toggleGetInterviewDetailsSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response });
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

    yield put(toggleGetInterviewDetailsFailure({ statusCode, statusText }));
  }
}

export function* watchGetInterviewDetails() {
  yield takeLatest(
    INTERVIEW_DETAILS_REQUESTS.GET_INTERVIEW_DETAILS_REQUEST,
    fetchGetInterviewDetails
  );
}
