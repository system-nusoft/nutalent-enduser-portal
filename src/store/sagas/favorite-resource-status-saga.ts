import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { FAVORITE_RESOURCES_REQUESTS } from "../request-types";
import {
  togglePostFavoriteResourcesStatusFailure,
  togglePostFavoriteResourcesStatusSuccess,
} from "../slices/features/favorite-resources";

const authService = new AppService();

function* fetchFavoriteResourcesStatus(action: any) {
  const { payload } = action;
  const { resourceId } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchFavoriteResourceStatus,
      baseUrl,
      { resourceId: resourceId }
    );

    yield put(togglePostFavoriteResourcesStatusSuccess({ ...response }));

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

    yield put(
      togglePostFavoriteResourcesStatusFailure({ statusCode, statusText })
    );
  }
}

export function* watchFavoriteResrouceStatus() {
  yield takeLatest(
    FAVORITE_RESOURCES_REQUESTS.POST_RESOURCES_STATUS_REQUEST,
    fetchFavoriteResourcesStatus
  );
}
