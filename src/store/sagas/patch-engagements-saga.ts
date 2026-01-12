import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { ALL_ENGAGEMENTS_REQUESTS } from "../request-types";
import {
  togglePatchEngagementsFailure,
  togglePatchEngagementsSuccess,
} from "../slices/features/all-engagements-reducer";

const authService = new AppService();

function* fetchPatchAllEngagements(action: any) {
  const { payload } = action;
  const { data, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchPatchEngagement,
      baseUrl,
      data,
      id
    );

    yield put(togglePatchEngagementsSuccess({ ...response }));

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

    yield put(togglePatchEngagementsFailure({ statusCode, statusText }));
  }
}

export function* watchFetchPatchEngagements() {
  yield takeLatest(
    ALL_ENGAGEMENTS_REQUESTS.PATCH_ENGAGEMENTS_REQUEST,
    fetchPatchAllEngagements
  );
}
