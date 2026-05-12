import { combineReducers } from "redux";
import aiFeatureReducer from "./ai";
import { allEngagementsFeatureReducer } from "./all-engagements-reducer";
import { appFeatureReducer } from "./app";
import { authFeatureReducer } from "./auth";
import { configurationFeatureReducer } from "./configuration-reducer";
import { dashboardFeatureReducer } from "./dashboard-reducer";
import { elasticSearchFeatureReducer } from "./elastic-search";
import { engagementsFeatureReducer } from "./engagements-reducer";
import { favoriteResourcesFeatureReducer } from "./favorite-resources";
import { inquiresFeatureReducer } from "./inquires-selector";
import { interviewDetailsFeatureReducer } from "./interview-details-reducer";
import smartSchedulerReducer from "./smart-scheduler-reducer";
import { interviewFeatureReducer } from "./interview-reducer";
import { invoicesFeatureReducer } from "./invoices-reducer";
import { messagesFeatureReducer } from "./messages-reducer";
import { passwordFeatureReducer } from "./password-reducer";
import { projectFeatureReducer } from "./project";
import { projectChartFeatureReducer } from "./project-chart-reducer";
import { resourceByIdFeatureReducer } from "./resource-by-id";
import { resourceChartFeatureReducer } from "./resource-chart-reducer";
import { resourcesFeatureReducer } from "./resources";
import { timeZonesFeatureReducer } from "./time-zone-reducer";
import { timelineChartFeatureReducer } from "./timeline-chart-reducer";
import { timesheetFeatureReducer } from "./timesheet-reducer";
import { uploadImageFeatureReducer } from "./upload-image-reducer";
import { userFeatureReducer } from "./user-reducer";
import { verifyTokenFeatureReducer } from "./verify-token-reducer";

const featuresReducer = combineReducers({
  app: appFeatureReducer,
  login: authFeatureReducer,
  resources: resourcesFeatureReducer,
  project: projectFeatureReducer,
  favoriteResources: favoriteResourcesFeatureReducer,
  password: passwordFeatureReducer,
  dashboard: dashboardFeatureReducer,
  resourceById: resourceByIdFeatureReducer,
  interview: interviewFeatureReducer,
  messages: messagesFeatureReducer,
  inquires: inquiresFeatureReducer,
  elasticSearch: elasticSearchFeatureReducer,
  timeZone: timeZonesFeatureReducer,
  interviewDetails: interviewDetailsFeatureReducer,
  smartScheduler: smartSchedulerReducer,
  user: userFeatureReducer,
  image: uploadImageFeatureReducer,
  engagements: engagementsFeatureReducer,
  timesheet: timesheetFeatureReducer,
  invoices: invoicesFeatureReducer,
  resourceChart: resourceChartFeatureReducer,
  projectChart: projectChartFeatureReducer,
  timelineChart: timelineChartFeatureReducer,
  verifyToken: verifyTokenFeatureReducer,
  configuration: configurationFeatureReducer,
  allEngagements: allEngagementsFeatureReducer,
  ai: aiFeatureReducer,
});

export { featuresReducer };
