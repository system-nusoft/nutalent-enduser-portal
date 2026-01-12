import ENDPOINTS from "src/store/Endpoints";
import { RESPONSE_TYPES } from "../../constants/response-types";
import { HttpService } from "../http";
import { prepareErrorResponse, prepareResponseObject } from "../http/response";

export class AppService extends HttpService {
  fetchAppData = async (baseAuthUrl: string): Promise<any> => {
    try {
      // Example of an API call to fetch the app-data
      // This would be consumed in an async action
      const apiResponse = await this.post(`${baseAuthUrl}app`, undefined);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };

  fetchGetResourcesData = async (
    baseAuthUrl: string,
    query: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.RESOURCES,
        query
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetProjectData = async (
    baseAuthUrl: string,
    query: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.PROJECT,
        query
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetFavoriteResourcesData = async (
    baseAuthUrl: string,
    query: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.FAVORITE_RESOURCES,
        query
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostCreateProject = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.PROJECT,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPutProject = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.put(
        `${baseAuthUrl}` + ENDPOINTS.UPDATE_PROJECT(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPatchPassword = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.UPDATE_PASSWORD,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchDashboardData = async (baseAuthUrl: string): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.DASHBOARD
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchSearchResource = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.SEARCH_RESOURCE,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchResourceEngagement = async (
    baseAuthUrl: string,
    data?: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.END_USER_ENGAGEMENTS,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchFavoriteResourceStatus = async (
    baseAuthUrl: string,
    data?: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.FAVORITE_RESOURCES,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostBookResource = async (
    baseAuthUrl: string,
    id: string,
    data?: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.HIRE_ENAGEMENT(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchResourceById = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.RESOURCE_BY_ID(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchInterviewScheduleList = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INTERVIEW,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchScheduleInterview = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.SCHEDULE_INTERVIEW(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetMessages = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.GET_MESSAGES(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostMessage = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.SEND_MESSAGE,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchReadMessage = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.READ_MESSAGES(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetInquires = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INQUIRES,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getInterviewDetails = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INTERVIEW_DETAILS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getElasticSearch = async (baseAuthUrl: string, query: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.ELASTIC_SEARCH,
        query
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  UploadJdSearch = async (baseAuthUrl: string, query: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.UPLOAD_JD,
        query,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchUpdateScheduleInterview = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.put(
        `${baseAuthUrl}` + ENDPOINTS.UPDATE_SCHEDULE_INTERVIEW(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetUser = async (baseAuthUrl: string): Promise<any> => {
    try {
      const apiResponse = await this.get(`${baseAuthUrl}` + ENDPOINTS.USER);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPutUser = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.put(
        `${baseAuthUrl}` + ENDPOINTS.USER,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postUploadImage = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.UPLOAD_IMAGE,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostEngagement = async (
    baseAuthUrl: string,
    id: string,
    data?: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.ENGAGEMENTS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetEngagement = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.ENGAGEMENTS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetTimesheetListing = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.TIMESHEET(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetTimesheetById = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.TIMESHEET_BY_ID(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPutTimesheet = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.put(
        `${baseAuthUrl}` + ENDPOINTS.TIMESHEET_STATUS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetInvoicesList = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INVOICES,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetInvoicesById = async (
    baseAuthUrl: string,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INVOICES_BY_ID(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPatchInvoice = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.PATCH_INVOICE(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchDashboardTimelineData = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.DASHBOARD_TIMELINE,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchDashboarProjectChartData = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.DASHBOARD_PROJECT_CHART,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchDashboarResourceChartData = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.DASHBOARD_RESOURCE_CHART,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchDashboardTimesheetData = async (
    baseAuthUrl: string,
    data: any,
    query: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.DASHBOARD_TIMESHEET(data),
        query
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchForgotPassword = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.FORGOT_PASSWORD,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchVerifyToken = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.VERIFY_TOKEN(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchResetPassword = async (
    baseAuthUrl: string,
    userId: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.RESET_PASSWORD(userId),
        data
        // { headers: { Authorization: `Bearer ${token}` } }
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchAccountSetup = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.ACCOUNT_SETUP,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetConfiguration = async (
    baseAuthUrl: string,
    id: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.CONFIGURATIONS(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostConfiguration = async (
    baseAuthUrl: string,
    id: any,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.CONFIGURATIONS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetAllEngagement = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.ALL_ENGAGEMENTS(),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPatchEngagement = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.PATCH_ENGAGEMENTS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
}
