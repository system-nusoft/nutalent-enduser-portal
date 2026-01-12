import {
  AUTH_REQUESTS,
  PASSWORDS_REQUESTS,
  USER_REQUESTS,
  VERIFY_TOKEN_REQUEST,
} from "../request-types";

class RequestAuthAction {
  static handleLogin(payload: {
    email: string;
    password: string;
    t: any;
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: AUTH_REQUESTS.LOGIN_REQUEST,
      payload,
    };
  }
  static handleForgotPassword(payload: {
    email: string;
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: PASSWORDS_REQUESTS.FORGOT_PASSWORD_REQUEST,
      payload,
    };
  }
  static handleVerifyToken(payload: {
    id: string;
    token: string;
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: VERIFY_TOKEN_REQUEST.POST_VERIFY_TOKEN_REQUEST,
      payload,
    };
  }
  static handleResetPassword(payload: {
    userId: string;
    password: string;
    token: string;
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: PASSWORDS_REQUESTS.RESET_PASSSWORD_REQUEST,
      payload,
    };
  }
  static handleAccountSetup(payload: {
    data: {
      userId: string | null;
      firstName: string;
      lastName: string;
      password: string;
      profilePicture?: string | null;
    };
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: USER_REQUESTS.POST_USER_REQUSET,
      payload,
    };
  }
}

export default RequestAuthAction;
