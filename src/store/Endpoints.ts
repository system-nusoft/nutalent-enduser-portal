export const limit = 10;

// using url without / at the start because base url ends with /
const ENDPOINTS = {
  LOGIN: "user/signin",
  SIGNOUT: "user/signout",
  RESOURCES: "end-user/booked-resource",
  FAVORITE_RESOURCES: "end-user/favorite-resource",
  PROJECT: "project",
  PROJECT_BY_ID: (id: string) => `project/${id}`,
  UPDATE_PASSWORD: `user/update-password`,
  DASHBOARD: `end-user/dashboard-data`,
  SEARCH_RESOURCE: `end-user/search-resource`,
  PROJECT_BY_ID_ADD_RESOURCE: (id: string) =>
    `project/${id}/resource-engagement/add`,
  END_USER_ENGAGEMENTS: `end-user/resource-engagement`,
  HIRE_ENAGEMENT: (resourceId: string) => `resource/${resourceId}/engagement`,
  RESOURCE_BY_ID: (resourceId: string) =>
    `end-user/search-resource/${resourceId}`,
  INTERVIEW: `schedule-interview`,
  SCHEDULE_INTERVIEW: (id: string) => `resource/${id}/schedule-interview`,
  READ_MESSAGES: (id: string) => `inquiry/${id}/read-messages`,
  GET_MESSAGES: (id: string) => `inquiry/${id}/messages`,
  SEND_MESSAGE: `end-user/send-message`,
  INQUIRES: `inquiry`,
  UPDATE_PROJECT: (id: string) => `project/${id}`,
  UPLOAD_JD: `end-user/upload-jd`,
  ELASTIC_SEARCH: `end-user/search-resource-es`,
  INTERVIEW_DETAILS: (id: string) =>
    `end-user/resource/${id}/interview-details`,
  UPDATE_SCHEDULE_INTERVIEW: (id: string) => `resource/${id}/interview-details`,
  USER: "user",
  UPLOAD_IMAGE: "upload-image",
  ENGAGEMENTS: (id: string) => `resource/${id}/engagement`,
  TIMESHEET: (engagementId: string) => `engagement/${engagementId}/timesheet`,
  TIMESHEET_BY_ID: (timesheetId: string) => `timesheet/${timesheetId}`,
  TIMESHEET_STATUS: (timesheetId: string) => `timesheet/${timesheetId}/status`,
  INVOICES_BY_ID: (id: string) => `invoice/${id}`,
  INVOICES: `invoice`,
  PATCH_INVOICE: (id: string) => `invoice/${id}/payment-status`,
  DASHBOARD_TIMELINE: `end-user/dashboard-data/resource-hours`,
  DASHBOARD_TIMESHEET: (id: string) => `timesheet/${id}/end-user`,
  DASHBOARD_PROJECT_CHART: `end-user/dashboard-data/project-resources`,
  DASHBOARD_RESOURCE_CHART: `end-user/dashboard-data/hired-resources`,
  FORGOT_PASSWORD: `user/forgot-password`,
  VERIFY_TOKEN: (id: string) => `user/${id}/verify-token`,
  RESET_PASSWORD: (id: string) => `user/${id}/reset-password`,
  ACCOUNT_SETUP: `end-user/account-setup`,
  CONFIGURATIONS: (id: string) => `end-user/${id}/configurations`,
  ALL_ENGAGEMENTS: () => `engagement`,
  PATCH_ENGAGEMENTS: (id: string) => `engagement/${id}/status`,
};

export default ENDPOINTS;
