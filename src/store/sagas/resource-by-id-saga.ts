import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { RESOURCES_BY_ID_REQUESTS } from "../request-types";
import {
  toggleGeResourceByIdFailure,
  toggleGeResourceByIdSuccess,
} from "../slices/features/resource-by-id";

const authService = new AppService();

function* fetchResourceById(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchResourceById,
      baseUrl,
      id,
      data
    );

    yield put(toggleGeResourceByIdSuccess({ ...response }));

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

    yield put(toggleGeResourceByIdFailure({ statusCode, statusText }));
  }
}

export function* watchResourceById() {
  yield takeLatest(
    RESOURCES_BY_ID_REQUESTS.GET_RESOURCES_BY_ID_REQUEST,
    fetchResourceById
  );
}
