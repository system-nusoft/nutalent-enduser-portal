import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components";
import { AppService } from "src/services/app";
import { AI_REQUESTS } from "../request-types";
import {
  toggleIdentifyRolesWithPricingFailure,
  toggleIdentifyRolesWithPricingSuccess,
} from "../slices/features/ai";

const appService = new AppService();

function* fetchIdentifyRolesWithPricing(action: any) {
  const { payload } = action;
  const { projectDescription, location, budget, requirements, cbSuccess, cbFailure } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.identifyRolesWithPricing,
      baseUrl,
      {
        projectDescription,
        location,
        budget,
        requirements,
      }
    );
    yield put(toggleIdentifyRolesWithPricingSuccess({ ...response }));

    cbSuccess && cbSuccess({ ...response });
  } catch (errors: any) {
    const error = errors?.data?.errors || errors;
    const statusCode = error?.statusCode || errors?.response?.status || 500;
    const statusText = error?.statusText || errors?.response?.statusText || 'Error';
    
    Notification({
      type: "error",
      message: errors?.data?.errors?.message || errors?.data?.message || errors?.message || "Failed to identify roles",
    });

    cbFailure &&
      cbFailure(
        errors?.data?.errors?.message || errors?.data?.message || errors?.message
      );

    yield put(toggleIdentifyRolesWithPricingFailure({ statusCode, statusText }));
  }
}

export function* watchIdentifyRolesWithPricing() {
  yield takeLatest(
    AI_REQUESTS.IDENTIFY_ROLES_WITH_PRICING_REQUEST,
    fetchIdentifyRolesWithPricing
  );
}
