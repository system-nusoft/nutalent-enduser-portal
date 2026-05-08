import { HttpService } from "../http";
import { prepareErrorResponse, prepareResponseObject } from "../http/response";
import { RESPONSE_TYPES } from "../../constants/response-types";

export interface Engagement {
  id: string;
  hiringStatus: string;
  hiringPeriod: string | null;
  requestedAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  resource: {
    id: string;
    firstName: string;
    lastName: string;
  };
  endUser: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface EngagementListResponse {
  data: {
    items: Engagement[];
    meta: {
      totalCount: number;
      count: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class EngagementService extends HttpService {
  async getEngagements(
    baseUrl: string,
    page: number = 1,
    limit: number = 10
  ): Promise<EngagementListResponse> {
    try {
      const apiResponse = await this.get(
        `${baseUrl}engagement`,
        { page: page.toString(), limit: limit.toString() }
      );
      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error: any) {
      throw prepareErrorResponse(error);
    }
  }

  async sendMessage(
    baseUrl: string,
    resourceId: string,
    message: string
  ): Promise<any> {
    try {
      const apiResponse = await this.post(
        `${baseUrl}end-user/send-message`,
        { resourceId, content: message }
      );
      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error: any) {
      throw prepareErrorResponse(error);
    }
  }
}
