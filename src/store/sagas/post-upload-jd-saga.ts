import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { ELASTIC_SEARCH_REQUESTS } from "../request-types";
import {
  togglePostJDElasticSearchFailure,
  togglePostJDElasticSearchSuccess,
} from "../slices/features/elastic-search";

const authService = new AppService();

function* fetchUploadJd(action: any) {
  const { payload } = action;
  const { file } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.UploadJdSearch,
      baseUrl,
      file
    );

    yield put(togglePostJDElasticSearchSuccess({ ...response }));

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

    yield put(togglePostJDElasticSearchFailure({ statusCode, statusText }));
  }
}

export function* watchPostUploadJd() {
  yield takeLatest(
    ELASTIC_SEARCH_REQUESTS.POST_JD_ELASTIC_SEARCH_REQUEST,
    fetchUploadJd
  );
}
