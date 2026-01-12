import {
  ENGAGEMENTS_STATUS,
  INTERVIEW_STATUS,
  INVOICES_STATUS,
  PROJECT_STATUS,
  RESOURCE_STATUS,
  TIMESHEET_STATUS,
} from "src/utils/enum";
import {
  ALL_ENGAGEMENTS_REQUESTS,
  CONFIGURATIONS_REQUESTS,
  DASHBOARD_REQUESTS,
  ELASTIC_SEARCH_REQUESTS,
  ENGAGEMENTS_REQUESTS,
  FAVORITE_RESOURCES_REQUESTS,
  INQUIRES_REQUESTS,
  INTERVIEW_DETAILS_REQUESTS,
  INTERVIEW_REQUESTS,
  INVOICES_REQUESTS,
  MESSAGE_REQUESTS,
  PASSWORDS_REQUESTS,
  PROJECT_REQUESTS,
  RESOURCES_BY_ID_REQUESTS,
  RESOURCES_REQUESTS,
  TIMESHEET_REQUESTS,
  UPLOAD_IMAGE_REQUESTS,
  USER_REQUESTS,
} from "../request-types";

class RequestAppAction {
  static handleGetResources(payload: {
    query: {
      page?: number;
      search?: string;
      availabilityStatus?: RESOURCE_STATUS;
    };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: RESOURCES_REQUESTS.GET_RESOURCES_REQUEST,
      payload,
    };
  }

  static handleGetProject(payload: {
    query: {
      page?: number;
      search?: string;
      projectStatus?: PROJECT_STATUS | "all";
    };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: PROJECT_REQUESTS.GET_PROJECT_REQUEST,
      payload,
    };
  }
  static handleGetFavoriteResrouces(payload: {
    query: {
      page?: number;
      search?: string;
      status?: RESOURCE_STATUS;
    };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: FAVORITE_RESOURCES_REQUESTS.GET_RESOURCES_REQUEST,
      payload,
    };
  }
  static handleCreateProject(payload: {
    data: {
      name: string;
      summary: string;
      startDate: Date | string;
      endDate: Date | string;
      status?: string;
      resourceEngagementIds?: string[];
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: PROJECT_REQUESTS.CREATE_PROJECT_REQUEST,
      payload,
    };
  }
  static handleUpdateProject(payload: {
    data: {
      name?: string;
      summary?: string;
      endDate?: Date | string;
      startDate?: Date | string;
      resourceEngagementIds?: string[];
      status?: string;
    };
    id: string;
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: PROJECT_REQUESTS.PUT_PROJECT_REQUEST,
      payload,
    };
  }
  static handleUpdatePassword(payload: {
    data: {
      currentPassword: string;
      newPassword: string;
    };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: PASSWORDS_REQUESTS.PATCH_PASSSWORD_REQUEST,
      payload,
    };
  }
  static handleGetDashboardRequest(payload?: {
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: DASHBOARD_REQUESTS.GET_DASHBOARD_REQUEST,
      payload,
    };
  }
  static handleSearchResourceRequest(payload?: {
    query: { search: string };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: RESOURCES_REQUESTS.GET_SEARCH_RESOURCES_REQUEST,
      payload,
    };
  }
  static handleGetResourceEngagment(payload?: {
    query?: {
      page?: number;
      search?: string;
    };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: RESOURCES_REQUESTS.GET_RESOURCES_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
  static handlePostFavoriteResourceStatus(payload?: {
    resourceId: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: FAVORITE_RESOURCES_REQUESTS.POST_RESOURCES_STATUS_REQUEST,
      payload,
    };
  }
  static handlePostBookResource(payload?: {
    id: string;
    data: { hiringPeriod: string };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: FAVORITE_RESOURCES_REQUESTS.POST_BOOK_RESOURCE_REQUEST,
      payload,
    };
  }
  static handleGetResourceById(payload?: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: RESOURCES_BY_ID_REQUESTS.GET_RESOURCES_BY_ID_REQUEST,
      payload,
    };
  }
  static handleGetInterviewListing(payload?: {
    data?: {
      startTime?: string | Date;
      endTime?: string | Date;
      resourceId?: string;
      partnerId?: string;
      userId: string;
      page?: number;
      search?: string;
      limit?: number;
      status?: INTERVIEW_STATUS;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INTERVIEW_REQUESTS.GET_INTERVIEW_REQUEST,
      payload,
    };
  }
  static handlePostInterview(payload?: {
    data?: {
      selectedSlotMeet: {
        startTime?: string | Date;
        endTime?: string | Date;
      };
      selectedSlot: {
        startTime?: string | Date;
        endTime?: string | Date;
      };
    };
    timeZone: string;
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INTERVIEW_REQUESTS.POST_INTERVIEW_REQUEST,
      payload,
    };
  }
  static handleSendMessage(payload?: {
    data?: {
      resourceId?: string;
      content?: string;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: MESSAGE_REQUESTS.POST_MESSAGE_REQUEST,
      payload,
    };
  }
  static handleReadMessage(payload?: {
    data?: {
      resourceId: string;
      content?: string;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: MESSAGE_REQUESTS.READ_MESSAGE_REQUEST,
      payload,
    };
  }
  static handleGetMessages(payload?: {
    data?: {
      page: number;
      limit?: number;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: MESSAGE_REQUESTS.GET_MESSAGES_REQUEST,
      payload,
    };
  }
  static handleGetInquires(payload?: {
    query?: {
      page: number;
      limit?: number;
      resourceId?: string;
      search?: string;
      endUserId?: string;
      partnerId?: string;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INQUIRES_REQUESTS.GET_INQUIRES_REQUEST,
      payload,
    };
  }
  static handleGetElasticSearch(payload?: {
    query?: {
      page: number;
      limit?: number;
      search?: string | undefined;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: ELASTIC_SEARCH_REQUESTS.GET_ELASTIC_SEARCH_REQUEST,
      payload,
    };
  }
  static handlePostJDSearch(payload?: {
    file: FormData;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: ELASTIC_SEARCH_REQUESTS.POST_JD_ELASTIC_SEARCH_REQUEST,
      payload,
    };
  }
  static handleGetInterviewDetails(payload?: {
    data: { timeZone: string };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INTERVIEW_DETAILS_REQUESTS.GET_INTERVIEW_DETAILS_REQUEST,
      payload,
    };
  }
  static handleUpdateInterview(payload?: {
    data?: {
      selectedSlotMeet: {
        startTime?: string | Date;
        endTime?: string | Date;
      };
      selectedSlot: {
        startTime?: string | Date;
        endTime?: string | Date;
      };
    };
    timeZone?: string;
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INTERVIEW_REQUESTS.UPDATE_INTERVIEW_REQUEST,
      payload,
    };
  }
  static handleGetUser(payload?: {
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: USER_REQUESTS.GET_USER_REQUEST,
      payload,
    };
  }
  static handlePutUser(payload?: {
    data: { name?: string | undefined; profilePicture?: string | null };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: USER_REQUESTS.PUT_USER_REQUEST,
      payload,
    };
  }
  static handleUploadImage(payload: {
    data: any;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: UPLOAD_IMAGE_REQUESTS.POST_IMAGE_REQUEST,
      payload,
    };
  }
  static handleGetEngagements(payload: {
    data: {
      page?: number;
      search?: string;
      hiringStatus?: ENGAGEMENTS_STATUS;
      limit?: number;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: ENGAGEMENTS_REQUESTS.GET_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
  static handlePostEngagements(payload: {
    data: {
      startDate: string | Date;
      endDate: string | Date;
      weeklyHours?: number | string;
    };
    id: string | null;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: ENGAGEMENTS_REQUESTS.POST_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
  static handleGetTimesheetListing(payload: {
    query: {
      page: number;
      limit?: number;
      search?: string | undefined;
      status?: TIMESHEET_STATUS;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: TIMESHEET_REQUESTS.GET_TIMESHEET_REQUEST,
      payload,
    };
  }
  static handleGetTimesheetById(payload: {
    id: string | null;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: TIMESHEET_REQUESTS.GET_TIMESHEET_BY_ID_REQUEST,
      payload,
    };
  }
  static handlePutTimesheet(payload: {
    data: { status: TIMESHEET_STATUS; comments?: string };
    id: string | null;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: TIMESHEET_REQUESTS.PUT_TIMESHEET_REQUEST,
      payload,
    };
  }
  static handleGetInvoices(payload: {
    query: {
      page: number;
      limit?: number;
      search?: string | undefined;
      paymentStatus?: INVOICES_STATUS;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INVOICES_REQUESTS.GET_INVOICES_REQUEST,
      payload,
    };
  }
  static handleGetInvoicesById(payload: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INVOICES_REQUESTS.GET_INVOICES_BY_ID_REQUEST,
      payload,
    };
  }
  static handlePatchInvoice(payload: {
    data: { status: "Confirmation Pending" };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: INVOICES_REQUESTS.PATCH_INVOICE_REQUEST,
      payload,
    };
  }
  static handleGetProjectChart(payload: {
    data: { startDate: string | Date; endDate: string | Date };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: DASHBOARD_REQUESTS.GET_DASHBOARD_PROJECT_REQUEST,
      payload,
    };
  }
  static handleGetResourcesChart(payload: {
    data: { startDate: string | Date; endDate: string | Date };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: DASHBOARD_REQUESTS.GET_DASHBOARD_RESOURCES_REQUEST,
      payload,
    };
  }
  static handleGetTimelineChart(payload: {
    data: { startDate: string | Date; endDate: string | Date };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: DASHBOARD_REQUESTS.GET_DASHBOARD_TIMELINE_REQUEST,
      payload,
    };
  }
  static handleGetDashboardTimesheetList(payload?: {
    id: string;
    data: { status: TIMESHEET_STATUS };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: TIMESHEET_REQUESTS.GET_DASHBOARD_TIMESHEET_REQUEST,
      payload,
    };
  }
  static handleGetConfiguration(payload?: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: CONFIGURATIONS_REQUESTS.GET_CONFIGURATIONS_REQUEST,
      payload,
    };
  }
  static handlePostConfiguration(payload?: {
    id: string;
    data: { value?: "true" | "false"; key?: "Auto Approve Timesheet" };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: CONFIGURATIONS_REQUESTS.POST_CONFIGURATIONS_REQUEST,
      payload,
    };
  }
  static handleGetAllEngagements(payload?: {
    data: {
      page?: number;
      search?: string;
      hiringStatus?: ENGAGEMENTS_STATUS;
      limit?: number;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: ALL_ENGAGEMENTS_REQUESTS.GET_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
  static handlePatchEngagement(payload?: {
    id: string;
    data: { hiringStatus: ENGAGEMENTS_STATUS };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: ALL_ENGAGEMENTS_REQUESTS.PATCH_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
}

export default RequestAppAction;
