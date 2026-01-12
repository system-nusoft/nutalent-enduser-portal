import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { FAVORITE_RESOURCES_REQUESTS } from "../request-types";
import {
  togglePostBookResourcesFailure,
  togglePostBookResourcesSuccess,
} from "../slices/features/favorite-resources";

const authService = new AppService();

function* fetchBookResource(action: any) {
  const { payload } = action;
  const { data, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchPostBookResource,
      baseUrl,
      id,
      data
    );

    yield put(togglePostBookResourcesSuccess({ ...response }));

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

    yield put(togglePostBookResourcesFailure({ statusCode, statusText }));
  }
}

export function* watchPostBookResrouce() {
  yield takeLatest(
    FAVORITE_RESOURCES_REQUESTS.POST_BOOK_RESOURCE_REQUEST,
    fetchBookResource
  );
}
