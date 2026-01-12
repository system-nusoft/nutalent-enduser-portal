import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { ALL_ENGAGEMENTS_REQUESTS } from "../request-types";
import {
  toggleGetEngagementsFailure,
  toggleGetEngagementsSuccess,
} from "../slices/features/all-engagements-reducer";

const authService = new AppService();

function* fetchGetAllEngagements(action: any) {
  const { payload } = action;
  const { data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchGetAllEngagement,
      baseUrl,
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

export function* watchFetchGetAllEngagements() {
  yield takeLatest(
    ALL_ENGAGEMENTS_REQUESTS.GET_ENGAGEMENTS_REQUEST,
    fetchGetAllEngagements
  );
}
