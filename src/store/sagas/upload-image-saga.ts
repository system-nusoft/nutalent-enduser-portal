import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { UPLOAD_IMAGE_REQUESTS } from "../request-types";
import {
  toggleUploadImageFailure,
  toggleUploadImageSuccess,
} from "../slices/features/upload-image-reducer";

const appService = new AppService();

function* postUploadImage(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postUploadImage,
      baseUrl,
      data
    );

    yield put(toggleUploadImageSuccess({ ...response }));

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

    yield put(toggleUploadImageFailure({ statusCode, statusText }));
  }
}

export function* watchUploadImage() {
  yield takeLatest(UPLOAD_IMAGE_REQUESTS.POST_IMAGE_REQUEST, postUploadImage);
}
