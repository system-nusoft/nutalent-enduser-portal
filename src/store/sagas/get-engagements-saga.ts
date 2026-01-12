import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { ENGAGEMENTS_REQUESTS } from "../request-types";
import {
  toggleGetEngagementsFailure,
  toggleGetEngagementsSuccess,
} from "../slices/features/engagements-reducer";

const authService = new AppService();

function* fetchGetEngagements(action: any) {
  const { payload } = action;
  const { data, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetEngagement,
      baseUrl,
      id,
      data
    );

    yield put(toggleGetEngagementsSuccess({ ...response }));

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

    yield put(toggleGetEngagementsFailure({ statusCode, statusText }));
  }
}

export function* watchFetchGetEngagements() {
  yield takeLatest(
    ENGAGEMENTS_REQUESTS.GET_ENGAGEMENTS_REQUEST,
    fetchGetEngagements
  );
}
