import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { AppService } from "src/services/app";
import { SMART_SCHEDULER_REQUESTS } from "../request-types";
import {
  toggleGetSmartSchedulerSlotsFailure,
  toggleGetSmartSchedulerSlotsRequest,
  toggleGetSmartSchedulerSlotsSuccess,
} from "../slices/features/smart-scheduler-reducer";

const authService = new AppService();

function* fetchGetSmartSchedulerSlots(action: any) {
  const { payload } = action;
  const { data } = payload;
  try {
    yield put(toggleGetSmartSchedulerSlotsRequest());
    const baseUrl: any = process.env.REACT_APP_BASE_URL;
    const response: AxiosResponse<any> = yield call(
      authService.fetchSmartSchedulerSlots,
      baseUrl,
      data
    );
    yield put(toggleGetSmartSchedulerSlotsSuccess({ ...response }));
    payload?.cbSuccess && payload?.cbSuccess({ ...response });
  } catch (errors: any) {
    const error = errors?.data?.errors || errors;
    const { statusCode, statusText } = error;
    payload?.cbFailure &&
        payload?.cbFailure(
        errors?.data?.errors?.message || errors?.data?.message
        );
    yield put(toggleGetSmartSchedulerSlotsFailure({ statusCode, statusText }));
    }
}

export function* watchGetSmartSchedulerSlots() {
  yield takeLatest(
    SMART_SCHEDULER_REQUESTS.GET_SMART_SCHEDULER_SLOTS_REQUEST,
    fetchGetSmartSchedulerSlots
  );
}