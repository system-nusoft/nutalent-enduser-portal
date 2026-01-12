import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { ENGAGEMENTS_REQUESTS } from "../request-types";
import {
  togglePostEngagementsFailure,
  togglePostEngagementsSuccess,
} from "../slices/features/engagements-reducer";

const authService = new AppService();

function* fetchPostEngagements(action: any) {
  const { payload } = action;
  const { data, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchPostEngagement,
      baseUrl,
      id,
      data
    );

    yield put(togglePostEngagementsSuccess({ ...response }));

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

    yield put(togglePostEngagementsFailure({ statusCode, statusText }));
  }
}

export function* watchFetchPostEngagements() {
  yield takeLatest(
    ENGAGEMENTS_REQUESTS.POST_ENGAGEMENTS_REQUEST,
    fetchPostEngagements
  );
}
