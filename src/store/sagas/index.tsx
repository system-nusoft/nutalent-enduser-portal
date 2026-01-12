import { all } from "redux-saga/effects";
import { watchPostBookResrouce } from "./book-resource-saga";
import { watchCreateProject } from "./create-project-saga";
import { watchGetDashboardTimesheet } from "./dashbboard-timesheet-listing-saga";
import { watchGetDashboardProjectChart } from "./dashboard-project-chart-saga";
import { watchGetDashboardResourceChart } from "./dashboard-resource-chart-saga";
import { watchGetDashboardData } from "./dashboard-saga";
import { watchGetDashboardTimeline } from "./dashboard-timeline-saga";
import { watchFavoriteResrouceStatus } from "./favorite-resource-status-saga";
import { watchFetchGetAllEngagements } from "./get-all-engagements-saga";
import { watchGetConfiguration } from "./get-configuration-saga";
import { watchGetElasticSearch } from "./get-elastic-search-saga";
import { watchFetchGetEngagements } from "./get-engagements-saga";
import { watchGetFavoriteResources } from "./get-favorite-resource-saga";
import { watchGetInquires } from "./get-inquires-saga";
import { watchGetInterviewList } from "./get-interview-listing";
import { watchGetInvoiceById } from "./get-invoice-by-id-saga";
import { watchGetInvoicesList } from "./get-invoices-saga";
import { watchGetMessages } from "./get-message-saga";
import { watchGetProject } from "./get-project-saga";
import { watchGetResources } from "./get-resources-saga";
import { watchGetTimesheetById } from "./get-timesheet-by-id-saga";
import { watchGetTimesheetListing } from "./get-timesheet-listing-saga";
import { watchGetUser } from "./get-user-saga";
import { watchGetInterviewDetails } from "./interview-schedule-saga";
import { watchLogin } from "./login-saga";
import { watchFetchPatchEngagements } from "./patch-engagements-saga";
import { watchPatchInvoice } from "./patch-invoice-saga";
import { watchAccountSetup } from "./post-account-setup-saga";
import { watchPostConfiguration } from "./post-configuration-saga";
import { watchFetchPostEngagements } from "./post-engagements-saga";
import { watchForgotPassword } from "./post-forgot-password-saga";
import { watchPostInterview } from "./post-interview-saga";
import { watchResetPassword } from "./post-reset-password-saga";
import { watchPostUploadJd } from "./post-upload-jd-saga";
import { watchUpdateInterview } from "./put-interview-saga";
import { watchPutTimesheet } from "./put-timesheet-saga";
import { watchPutUser } from "./put-user-saga";
import { watchReadMessages } from "./read-message-saga";
import { watchResourceById } from "./resource-by-id-saga";
import { watchGetResrouceEngagements } from "./resource-engaements-saga";
import { watchGetSearchResrouce } from "./search-resrouces-saga";
import { watchPostMessages } from "./send-message-saga";
import { watchPatchPassword } from "./update-password-saga";
import { watchPutProject } from "./update-project-saga";
import { watchUploadImage } from "./upload-image-saga";
import { watchVerifyToken } from "./verify-token-saga";
export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchGetResources(),
    watchGetProject(),
    watchGetFavoriteResources(),
    watchCreateProject(),
    watchPutProject(),
    watchPatchPassword(),
    watchGetDashboardData(),
    watchGetResrouceEngagements(),
    watchGetSearchResrouce(),
    watchFavoriteResrouceStatus(),
    watchPostBookResrouce(),
    watchResourceById(),
    watchGetInterviewList(),
    watchPostInterview(),
    watchGetMessages(),
    watchPostMessages(),
    watchReadMessages(),
    watchGetInquires(),
    watchGetInterviewDetails(),
    watchPostUploadJd(),
    watchGetElasticSearch(),
    watchUpdateInterview(),
    watchGetUser(),
    watchPutUser(),
    watchUploadImage(),
    watchFetchPostEngagements(),
    watchFetchGetEngagements(),
    watchGetTimesheetListing(),
    watchGetTimesheetById(),
    watchPutTimesheet(),
    watchGetInvoicesList(),
    watchGetInvoiceById(),
    watchPatchInvoice(),
    watchGetDashboardTimeline(),
    watchGetDashboardResourceChart(),
    watchGetDashboardProjectChart(),
    watchGetDashboardTimesheet(),
    watchForgotPassword(),
    watchVerifyToken(),
    watchResetPassword(),
    watchAccountSetup(),
    watchGetConfiguration(),
    watchPostConfiguration(),
    watchFetchGetAllEngagements(),
    watchFetchPatchEngagements(),
  ]);
}
