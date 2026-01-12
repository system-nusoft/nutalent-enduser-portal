import axios from "axios";
import { store } from "src/App";
import { toggleClearLogin } from "src/store/slices/features/auth";
import { REFRESH_TOKEN_HEADER } from "../../constants/auth";
import { RESPONSE_TYPES, STATUS_CODES } from "../../constants/response-types";
import { LocalStorageService } from "../local-storage";
const localStorageService = new LocalStorageService();
axios.interceptors.request.use(
  async function (req) {
    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async (response) => {
    if (response.headers[REFRESH_TOKEN_HEADER]) {
      const token: any = await localStorageService.fetch("user");
      const parsed = JSON.parse(token);
      response.headers.Authorization = `Bearer ${parsed?.jwtToken}`;
    }

    return response;
  },
  async (error) => {
    if (
      axios.isCancel(error) ||
      error?.message === RESPONSE_TYPES.NETWORK_ERROR ||
      error?.response?.status === 408 ||
      error?.code === "ECONNABORTED"
    ) {
      return Promise.reject({ noInternet: true });
    }

    if (error?.response?.status === STATUS_CODES.UNAUTHORIZED) {
      await localStorageService.remove("user");
      store.dispatch(toggleClearLogin());
    }

    return Promise.reject(error);
  }
);
