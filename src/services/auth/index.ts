import ENDPOINTS from "src/store/Endpoints";
import { RESPONSE_TYPES } from "../../constants/response-types";
import { HttpService } from "../http";
import { prepareErrorResponse, prepareResponseObject } from "../http/response";
import { LocalStorageService } from "../local-storage";

const localStorageService = new LocalStorageService();
export class AuthService extends HttpService {
  signOut = async (/* _baseAuthUrl: string */): Promise<any> => {
    try {
      localStorageService.remove("user");
      // const apiResponse = await this.post(`${baseAuthUrl}sign-out`,
      //   undefined );

      // return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };

  signIn = async (
    _baseAuthUrl: string,
    data: Record<string, any>
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${_baseAuthUrl + ENDPOINTS.LOGIN}`,
        data
      );
      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };

  signUp = async (baseUrl: string, data: Record<string, any>): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseUrl}/sign-up`,
        data,
        undefined
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
}
