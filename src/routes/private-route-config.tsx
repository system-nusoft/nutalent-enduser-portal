import { HddOutlined } from "@ant-design/icons";
import {
  AddUserBlack,
  Calender,
  ClockSideBar,
  HomeIcon,
  InquiriesSidebarIcon,
  InterviewSidebarIcon,
  InvoicesSidebarIcon,
  List,
  User,
} from "src/assets";
import {
  CreateProject,
  Profile,
  ProjectListing,
  ResourceListing,
  ResourceProfile,
} from "src/pages";
import { AllEngagementListing } from "src/pages/all-engagements";
import { EngagementListing } from "src/pages/engagements";
import { HireNow } from "src/pages/hire-now";
import { HireResource } from "src/pages/hire-resource";
import { Home } from "src/pages/home";
import { Inquires } from "src/pages/inquires";
import { InterviewListing } from "src/pages/Interview";
import { InvoiceById } from "src/pages/invoice-by-id";
import { InvoicesListing } from "src/pages/invoices";
import { NewResource } from "src/pages/new-resource";
import { ScheduledInterview } from "src/pages/schedule-interview";
import { TimeSheet } from "src/pages/timesheet";
import { ViewTimesheet } from "src/pages/timesheet-by-id";
import { colors } from "src/utils/colors";
import { ROLES } from "../constants/roles";

// TODO:
/*
 * 1. Make title optional
 * 2. Make title multi type support ie: (string, node, react element)
 * 3. Add child route support
 * */

export default [
  {
    component: (props: any) => <NewResource {...props} />,
    path: "/hire-now",
    title: "Hire Now",
    permission: [ROLES.END_USER],
    icon: () => <AddUserBlack fill={colors.textColor} />,
    children: [
      {
        component: (props: any) => <ResourceProfile {...props} />,
        path: "hire-now/resources/:id",
        title: "Resource Profile",
        permission: [ROLES.END_USER],
        icon: () => <User />,
        sidebar: false,
        removeBackBtn: true,
      },
      {
        component: (props: any) => <HireNow {...props} />,
        path: "hire-now/new-resource",
        title: "Hire Now",
        permission: [ROLES.END_USER],
      },
      {
        component: (props: any) => <HireResource {...props} />,
        path: "hire-now/resources/:id/hire-resource",
        title: "Hire Resource",
        permission: [ROLES.END_USER],
        sidebar: false,
      },
      {
        component: (props: any) => <Profile {...props} />,
        path: "hire-now/resources/:id/profile",
        title: "Resource Profile",
        permission: [ROLES.END_USER],
        icon: () => <User />,
        sidebar: false,
        removeBackBtn: false,
      },
      {
        component: (props: any) => <ScheduledInterview {...props} />,
        path: "hire-now/resources/:id/schedule-interview",
        title: "Create Project",
        permission: [ROLES.END_USER],
        sidebar: false,
      },
    ],
    sidebar: true,
  },
  {
    component: (props: any) => <Home {...props} />,
    path: "/",
    title: "Dashboard",
    permission: [ROLES.END_USER],
    icon: () => <HomeIcon />,
    sidebar: true,
  },
  {
    component: (props: any) => <ResourceListing {...props} />,
    path: "/resources",
    title: "Resources",
    hashPath: "/resources#hire",
    permission: [ROLES.END_USER],
    icon: () => <Calender />,
    children: [
      {
        component: (props: any) => <ResourceProfile {...props} />,
        path: "resources/:id",
        title: "Resource Profile",
        permission: [ROLES.END_USER],
        icon: () => <User />,
        sidebar: false,
        removeBackBtn: true,
      },
      {
        component: (props: any) => <TimeSheet {...props} />,
        path: "resources/:id/engagements/:engId/timesheets",
        title: "Timesheets",
        permission: [ROLES.END_USER],
        icon: () => <ClockSideBar />,
      },
      {
        component: (props: any) => <EngagementListing {...props} />,
        path: "resources/:id/engagements",
        title: "Engagements",
        permission: [ROLES.END_USER],
      },
      {
        component: (props: any) => <ViewTimesheet {...props} />,
        path: "resources/:id/engagements/:engId/timesheets/:j",
        title: "Invoice",
        permission: [ROLES.END_USER],
        sidebar: false,
        removeBackBtn: true,
      },
    ],
    sidebar: true,
  },
  {
    component: (props: any) => <ProjectListing {...props} />,
    path: "/project",
    title: "Projects",
    permission: [ROLES.END_USER],
    icon: () => <List />,
    sidebar: true,
    children: [
      {
        component: (props: any) => <CreateProject {...props} />,
        path: "project/create-project",
        title: "Create Project",
        removeBackBtn: true,
        permission: [ROLES.END_USER],
        sidebar: false,
      },
      {
        component: (props: any) => <CreateProject {...props} />,
        path: "project/:id/update-project",
        title: "Update Project",
        removeBackBtn: true,
        permission: [ROLES.END_USER],
        sidebar: false,
      },
    ],
  },
  {
    component: (props: any) => <InterviewListing {...props} />,
    path: "/interviews",
    title: "Interviews",
    permission: [ROLES.END_USER],
    icon: () => <InterviewSidebarIcon />,
    sidebar: true,
    children: [
      {
        component: (props: any) => <ScheduledInterview {...props} />,
        path: "interviews/:id/schedule-interview",
        title: "Update Interview",
        permission: [ROLES.END_USER],
        sidebar: false,
      },
    ],
  },
  {
    component: (props: any) => <Profile {...props} />,
    path: "/settings",
    title: "Profile Settings",
    permission: [ROLES.END_USER],
    icon: () => <User />,
    sidebar: true,
  },
  // {
  //   component: (props: any) => <HelpAndFeedBack {...props} />,
  //   path: "/help-and-feedback",
  //   title: "Help & Feedback",
  //   permission: [ROLES.END_USER],
  //   icon: () => <User />,
  //   sidebar: false,
  // },
  {
    component: (props: any) => <Inquires {...props} />,
    path: "/inquiries",
    title: "Inquiries",
    permission: [ROLES.END_USER],
    icon: () => <InquiriesSidebarIcon />,
    sidebar: true,
  },
  {
    component: (props: any) => <InvoicesListing {...props} />,
    path: "/invoices",
    title: "Invoices",
    permission: [ROLES.END_USER],
    icon: () => <InvoicesSidebarIcon />,
    sidebar: true,
    children: [
      {
        component: (props: any) => <ViewTimesheet {...props} />,
        path: "invoices/:id/engagements/:engId/timesheets/:id",
        title: "Invoice",
        permission: [ROLES.END_USER],
        sidebar: false,
        removeBackBtn: true,
      },
      {
        component: (props: any) => <InvoiceById {...props} />,
        path: "invoices/:id",
        title: "Invoice",
        permission: [ROLES.END_USER],
        sidebar: false,
      },
    ],
  },
  {
    component: (props: any) => <AllEngagementListing {...props} />,
    path: "/engagements",
    title: "Engagements",
    hashPath: "/engagements#active",
    permission: [ROLES.END_USER],
    icon: () => <HddOutlined />,
    children: [
      {
        component: (props: any) => <TimeSheet {...props} />,
        path: "engagements/:engId/timesheets",
        title: "Timesheets",
        permission: [ROLES.END_USER],
        icon: () => <ClockSideBar />,
      },
      {
        component: (props: any) => <ViewTimesheet {...props} />,
        path: "engagements/:engId/timesheets/:j",
        title: "Invoice",
        permission: [ROLES.END_USER],
        sidebar: false,
        removeBackBtn: true,
      },
    ],
    sidebar: true,
  },
];
