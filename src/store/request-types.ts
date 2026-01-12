export enum AUTH_REQUESTS {
  LOGIN_REQUEST = "authentication/toggleLogin",
  SIGN_UP_REQUEST = "", //TODO: reducer for signup
  LOGOUT_REQUEST = "authentication/logout", //Clear state
}

// export enum LOGIN_RESOURCE_REQUESTS { //enum and redux state to check if the user has booked resources else lock other pages
//   GET_RESOURCES_REQUEST = "resourcesLogin/toggleGetResources",
// }
export enum RESOURCES_REQUESTS {
  GET_RESOURCES_REQUEST = "resources/toggleGetResources",
  GET_SEARCH_RESOURCES_REQUEST = "resources/toggleGetSearchResources",
  GET_RESOURCES_ENGAGEMENTS_REQUEST = "resources/toggleGetResourcesEngagement",
}
export enum DASHBOARD_REQUESTS {
  GET_DASHBOARD_REQUEST = "dashboard/toggleGetDashboard",
  GET_DASHBOARD_RESOURCES_REQUEST = "resourceChart/toggleGetDashboardResourceChart",
  GET_DASHBOARD_PROJECT_REQUEST = "projectChart/toggleGetDashboardProjectChart",
  GET_DASHBOARD_TIMELINE_REQUEST = "timelineChart/toggleGetDashboardTimelineChart",
}

export enum PROJECT_REQUESTS {
  GET_PROJECT_REQUEST = "project/toggleGetProject",
  CREATE_PROJECT_REQUEST = "project/toggleCreateProject",
  PUT_PROJECT_REQUEST = "project/togglePutProject",
}

export enum FAVORITE_RESOURCES_REQUESTS {
  GET_RESOURCES_REQUEST = "favoriteResources/toggleGetFavoriteResources",
  POST_RESOURCES_STATUS_REQUEST = "favoriteResources/togglePostFavoriteResourcesStatus",
  POST_BOOK_RESOURCE_REQUEST = "favoriteResources/togglePostBookResources",
}
export enum RESOURCES_BY_ID_REQUESTS {
  GET_RESOURCES_BY_ID_REQUEST = "resourceById/toggleGeResourceById",
}

export enum VERIFY_TOKEN_REQUEST {
  POST_VERIFY_TOKEN_REQUEST = "verifyToken/toggleVerifyToken",
}

export enum PASSWORDS_REQUESTS {
  PATCH_PASSSWORD_REQUEST = "password/togglePatchPassword",
  RESET_PASSSWORD_REQUEST = "password/toggleResetPassword",
  FORGOT_PASSWORD_REQUEST = "password/toggleForgotPassword",
}
export enum INTERVIEW_REQUESTS {
  GET_INTERVIEW_REQUEST = "interview/toggleGetInterview",
  POST_INTERVIEW_REQUEST = "interview/togglePostInterview",
  UPDATE_INTERVIEW_REQUEST = "interview/toggleUpdateInterview",
}

export enum MESSAGE_REQUESTS {
  GET_MESSAGES_REQUEST = "messages/toggleGetMessages",
  POST_MESSAGE_REQUEST = "messages/togglePostMessage",
  READ_MESSAGE_REQUEST = "messages/toggleReadMessage",
}

export enum INQUIRES_REQUESTS {
  GET_INQUIRES_REQUEST = "inquires/toggleGetInquires",
}

export enum ELASTIC_SEARCH_REQUESTS {
  GET_ELASTIC_SEARCH_REQUEST = "elasticSearch/toggleGetElasticSearch",
  POST_JD_ELASTIC_SEARCH_REQUEST = "elasticSearch/togglePostJDElasticSearch",
}

export enum INTERVIEW_DETAILS_REQUESTS {
  GET_INTERVIEW_DETAILS_REQUEST = "interviewDetails/toggleGetInterviewDetails",
}
export enum USER_REQUESTS {
  GET_USER_REQUEST = "user/toggleGetUser",
  PUT_USER_REQUEST = "user/togglePutUser",
  POST_USER_REQUSET = "user/togglePostUser",
}
export enum UPLOAD_IMAGE_REQUESTS {
  POST_IMAGE_REQUEST = "image/toggleUploadImage",
}

export enum ENGAGEMENTS_REQUESTS {
  GET_ENGAGEMENTS_REQUEST = "engagements/toggleGetEngagements",
  POST_ENGAGEMENTS_REQUEST = "engagements/togglePostEngagements",
}

export enum TIMESHEET_REQUESTS {
  GET_TIMESHEET_REQUEST = "timesheet/toggleGetTimesheetListing",
  GET_DASHBOARD_TIMESHEET_REQUEST = "dashboard/toggleGetDashboardTimesheetListing",
  GET_TIMESHEET_BY_ID_REQUEST = "timesheet/toggleGetTimesheetById",
  PUT_TIMESHEET_REQUEST = "timesheet/togglePutTimesheet",
}
export enum INVOICES_REQUESTS {
  GET_INVOICES_REQUEST = "invoices/toggleGetInvoicesListing",
  GET_INVOICES_BY_ID_REQUEST = "invoices/toggleGetInvoicesById",
  PATCH_INVOICE_REQUEST = "invoices/togglePatchInvoice",
}
export enum CONFIGURATIONS_REQUESTS {
  GET_CONFIGURATIONS_REQUEST = "configurations/toggleGetConfigurations",
  POST_CONFIGURATIONS_REQUEST = "configurations/togglePostConfigurations",
}

export enum ALL_ENGAGEMENTS_REQUESTS {
  GET_ENGAGEMENTS_REQUEST = "allEngagements/toggleGetEngagements",
  PATCH_ENGAGEMENTS_REQUEST = "allEngagements/togglePatchEngagements",
}
