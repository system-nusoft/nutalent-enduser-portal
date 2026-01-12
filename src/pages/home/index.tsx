import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import {
  Avatar,
  Divider,
  Empty,
  Skeleton,
  Spin,
  Table,
  Tabs,
  TabsProps,
  Tooltip,
} from "antd";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddUser, Info } from "src/assets";
import { Button, Card, Tag } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import { LocalStorageService } from "src/services/local-storage";
import { limit } from "src/store/Endpoints";
import { getGreeting } from "src/store/selectors/features/app";
import {
  dashboardLoading,
  getDashboardData,
} from "src/store/selectors/features/dashboard";
import {
  getInterviewList,
  interviewLoading,
} from "src/store/selectors/features/interview-selector";
import {
  getInvoicesList,
  invoicesLoading,
} from "src/store/selectors/features/invoices-selector";
import { getUserId } from "src/store/selectors/features/login-selector";
import { projectChartLoading } from "src/store/selectors/features/project-chart-selector";
import { ResourceChartLoading } from "src/store/selectors/features/resource-chart-selector";
import { TimelineLoading } from "src/store/selectors/features/timeline-selector";
import {
  getTimesheetData,
  timesheetLoading,
} from "src/store/selectors/features/timesheet-selector";
import { getUserData } from "src/store/selectors/features/user-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { chartColorsList, colors } from "src/utils/colors";
import { INVOICES_STATUS, TIMESHEET_STATUS } from "src/utils/enum";
import { returnDateOnly, returnDateYear } from "src/utils/functions";
import styles from "./styles.module.scss";

const localStorageService = new LocalStorageService();
export const Home: React.FC = () => {
  const { t } = useTranslation();
  const username: any = useSelector(getUserData);
  const userId = useSelector(getUserId);
  const data: any = useSelector(getDashboardData);
  const isFetchingDetails = useSelector(dashboardLoading);
  const dispatch = useDispatch();
  const interviewListing = useSelector(getInterviewList);
  const isFetchingInterviewList = useSelector(interviewLoading);
  const [showHireNow, setShowHireNow] = useState(false);
  const isFetchingHiredResource = useSelector(ResourceChartLoading);
  const isFetchingTimeline = useSelector(TimelineLoading);
  const isFetchingProjectChart = useSelector(projectChartLoading);
  const isFetchingTimesheet = useSelector(timesheetLoading);
  const isFetchingInvoices = useSelector(invoicesLoading);
  const invoicesListing = useSelector(getInvoicesList);
  const timesheetListing: any = useSelector(getTimesheetData);
  const getMonthsArray = (count: number) => {
    const months = [];
    const currentDate = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      months.push(date.toLocaleString("default", { month: "short" }));
    }
    return months;
  };

  const getDaysArray = (days: number) => {
    const daysArray = [];
    const currentDate = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      daysArray.push(
        `${date.getDate()} ${date.toLocaleString("default", {
          month: "short",
        })}`
      );
    }
    return daysArray;
  };

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [
      {
        name: "",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        type: "area", // Valid chart type
        height: 350,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },

      xaxis: {
        type: "category", // Specify type as 'datetime' for time-series data
        categories: getDaysArray(7),
      },
      yaxis: {
        show: false,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
    },
  });
  //
  const [resourceBreakdownNotFound, setResourceBreakdownNotFound] =
    useState(false);
  const updateResourceBreakdownChart = (res: any) => {
    const values = res?.engagementSkillsBreakdownPieChart?.values ?? [];
    const labels = res?.engagementSkillsBreakdownPieChart?.labels ?? [];

    if (labels?.length > 0) {
      setResourceBreakdownNotFound(false);
      if (Array.isArray(values) && values?.length > 0) {
        setresourcesTypeChartData((pre) => ({
          ...pre,
          series: values ?? [],
          options: {
            ...pre.options,
            tooltip: { enabled: true },
            labels: labels.map((i: string) =>
              typeof i === "string" ? i.split(" ")[0] : ""
            ),
          },
        }));
      }
    } else {
      setResourceBreakdownNotFound(true);
    }
  };

  const [totalHoursChartData, setTotalHoursChartData] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [100],

    options: {
      colors: chartColorsList,
      chart: {
        type: "pie",
      },
      labels: ["", "", "", "", ""],
      stroke: { width: 5 },

      dataLabels: {
        enabled: false,
      },
      tooltip: { enabled: false },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              show: false,
            },
          },
        },
      ],

      xaxis: {
        type: "category", // Specify type as 'datetime' for time-series data
        categories: getDaysArray(7),
      },
      yaxis: {
        show: false,
      },
      legend: {
        position: "right",
        offsetY: 0,
      },
    },
  });
  const [resourcesTypeChartData, setresourcesTypeChartData] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [100],
    options: {
      colors: chartColorsList,
      labels: ["", "", "", "", ""],
      stroke: { width: 5 },
      dataLabels: {
        enabled: false,
      },

      responsive: [
        {
          breakpoint: 480,

          options: {
            chart: {
              width: 300,
              height: 300,
            },
            legend: {
              show: false,
            },
          },
        },
      ],

      xaxis: {
        type: "category", // Specify type as 'datetime' for time-series data
        categories: getDaysArray(7),
      },
      yaxis: {
        show: false,
      },
      tooltip: { enabled: false },
      legend: {
        position: "right",
        offsetY: 0,
      },
    },
  });
  // const [barChartData, setBarChartData] = useState<{
  //   series: { name: string; data: number[] }[];
  //   options: ApexOptions;
  // }>({
  //   series: [{ name: "", data: [] }],
  //   options: {
  //     chart: {
  //       type: "bar",
  //       width: "100%",
  //       stacked: true,
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     plotOptions: {
  //       bar: {
  //         borderRadius: 10,
  //         dataLabels: {
  //           position: "top", // top, center, bottom
  //         },
  //       },
  //     },
  //     colors: chartColorsList,
  //     dataLabels: {
  //       enabled: true,
  //       formatter: function (val) {
  //         return val + "%";
  //       },
  //       offsetY: -20,
  //       style: {
  //         fontSize: "12px",
  //         colors: chartColorsList,
  //       },
  //     },

  //     xaxis: {
  //       categories: [
  //         "Jan",
  //         "Feb",
  //         "Mar",
  //         "Apr",
  //         "May",
  //         "Jun",
  //         "Jul",
  //         "Aug",
  //         "Sep",
  //         "Oct",
  //         "Nov",
  //         "Dec",
  //       ],
  //       position: "top",
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },

  //       tooltip: {
  //         enabled: true,
  //       },
  //     },
  //     legend: {
  //       show: true,
  //       showForSingleSeries: true,

  //       position: "top",
  //       horizontalAlign: "right",
  //       customLegendItems: [""],
  //     },
  //     yaxis: {
  //       axisBorder: {
  //         show: false,
  //       },
  //       axisTicks: {
  //         show: false,
  //       },
  //       labels: {
  //         show: false,
  //         formatter: function (val) {
  //           return val + "%";
  //         },
  //       },
  //     },
  //   },
  // });

  const fetchtDashboardData = () => {
    dispatch(
      RequestAppAction.handleGetDashboardRequest({
        cbSuccess: (res) => {
          updateResourceBreakdownChart(res);
        },
      })
    );
  };

  useEffect(() => {
    fetchtDashboardData();
    isFirstTime();
    handleInterviewTimelineChange("1");
    handleTimelineChartChange("1");
    handleTimelineChange("1");
    // handleProjectValuesChange("1")
    dispatch(
      RequestAppAction.handleGetInvoices({
        query: {
          page: 1,
          limit: limit,
          paymentStatus: INVOICES_STATUS.PENDING,
        },
      })
    );
  }, []);

  // const handleProjectValuesChange = (key: string) => {
  //   let newCategories: string[] = [];
  //   let range = {
  //     startDate: new Date().toISOString(), // Current date as ISO string
  //     endDate: new Date().toISOString(), // Current date as ISO string
  //   };

  //   switch (key) {
  //     case "1":
  //       newCategories = getMonthsArray(12);
  //       range.endDate = createDate(12, "month");
  //       break;
  //     case "2":
  //       newCategories = getMonthsArray(3);
  //       range.endDate = createDate(3, "month");
  //       break;
  //     case "3":
  //       newCategories = getDaysArray(30);
  //       range.endDate = createDate(30, "day");
  //       break;
  //     case "4":
  //       newCategories = getDaysArray(7);
  //       range.endDate = createDate(7, "day");
  //       break;

  //     default:
  //       break;
  //   }

  //   dispatch(
  //     RequestAppAction.handleGetProjectChart({
  //       data: { startDate: range.endDate, endDate: range.startDate },
  //       cbSuccess: (res) => {
  //         if (Array.isArray(res?.data) && res?.data?.length > 0)
  //           setBarChartData((prev) => ({
  //             ...prev,
  //             series: res?.data,
  //             options: {
  //               ...prev.options,
  //               legend: {
  //                 ...prev.options.legend,
  //                 customLegendItems: res?.data?.map(
  //                   (i: { name: string }) => i?.name
  //                 ),
  //               },
  //               xaxis: { ...prev.options.xaxis, categories: newCategories },
  //             },
  //           }));
  //       },
  //     })
  //   );
  // };

  const handleTimelineChange = (key: string) => {
    let newCategories: string[] = [];
    let range = {
      startDate: new Date().toISOString(), // Current date as ISO string
      endDate: new Date().toISOString(), // Current date as ISO string
    };

    switch (key) {
      case "1":
        newCategories = getDaysArray(7);
        range.endDate = createDate(7, "day");
        break;
      case "2":
        newCategories = getDaysArray(30);
        range.endDate = createDate(30, "day");
        break;
      case "3":
        newCategories = getMonthsArray(3);
        range.endDate = createDate(3, "month");
        break;
      case "4":
        newCategories = getMonthsArray(12);
        range.endDate = createDate(12, "month");

        break;

      default:
        break;
    }

    dispatch(
      RequestAppAction.handleGetResourcesChart({
        data: { startDate: range.endDate, endDate: range.startDate },
        cbSuccess: (res) => {
          setChartData((prev) => ({
            ...prev,
            series: [{ ...prev.series[0], data: res?.data }],
            options: {
              ...prev.options,
              xaxis: { ...prev.options.xaxis, categories: newCategories },
            },
          }));
        },
      })
    );
  };

  const createDate = (number: number, type: "month" | "day") => {
    const date = new Date(); // Current date
    if (type === "month") {
      date.setMonth(date.getMonth() - number); // Subtract months
    } else if (type === "day") {
      date.setDate(date.getDate() - number); // Subtract days
    }
    return date.toISOString(); // Return ISO string
  };

  const [topPerformersNotFound, setTopPerformersNotFound] = useState(false);
  const handleTimelineChartChange = (key: string) => {
    let range = {
      startDate: new Date().toISOString(), // Current date as ISO string
      endDate: new Date().toISOString(), // Current date as ISO string
    };
    switch (key) {
      case "1":
        range.endDate = createDate(7, "day");
        break;
      case "2":
        range.endDate = createDate(30, "day");
        break;
      case "3":
        range.endDate = createDate(3, "month");
        break;
      case "4":
        range.endDate = createDate(12, "month");
        break;
      default:
        break;
    }

    dispatch(
      RequestAppAction.handleGetTimelineChart({
        data: { startDate: range.endDate, endDate: range.startDate },
        cbSuccess: (res) => {
          if (res?.labels?.length > 0) {
            setTotalHoursChartData((prev) => ({
              ...prev,
              series: res?.values ?? [],
              options: {
                ...prev.options,
                labels: res?.labels,
                legend: { show: true },
              },
            }));
            setTopPerformersNotFound(false);
          } else {
            setTopPerformersNotFound(true);
          }
        },
      })
    );
  };

  const addDate = (number: number, type: "month" | "day") => {
    const date = new Date(); // Current date
    if (type === "month") {
      date.setMonth(date.getMonth() + number); // Subtract months
    } else if (type === "day") {
      date.setDate(date.getDate() + number); // Subtract days
    }
    return date.toISOString(); // Return ISO string
  };

  const handleInterviewTimelineChange = (key: string) => {
    let range = {
      startDate: new Date().toISOString(), // Current date as ISO string
      endDate: new Date().toISOString(), // Current date as ISO string
    };
    switch (key) {
      case "1":
        range.startDate = addDate(7, "day");
        break;
      case "2":
        range.startDate = addDate(15, "day");
        break;
      case "3":
        range.startDate = addDate(30, "day");
        break;
      default:
        break;
    }

    if (userId)
      dispatch(
        RequestAppAction.handleGetInterviewListing({
          data: { userId, endTime: range.startDate, startTime: range.endDate },
        })
      );
  };

  const cardContent = [
    {
      content: (
        <div className="p-5 flex flex-col gap-6">
          <div className="w-96 flex gap-1 flex-col">
            <div className={styles.cardHeading}>
              {t("card.heading.readyToGetStarted")}
            </div>
            <div className={styles.cardDescription}>
              {t("card.desc.readyToGetStarted")}
            </div>
          </div>
          <div>
            <Button
              btn_class="white_btn"
              onClick={() => navigate(ROUTES.HIRENOWREPLACE)}
              label={t("button.hireNow")}
            />
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="flex justify-end">
          <img
            src={require("../../assets/image/card-chart-revelent.png")}
            className={`${styles.img}`}
          />
        </div>
      ),
    },
  ];

  const detailCard = ({
    heading,
    number,
    onClick,
    growthRate,
    tooltipText,
  }: {
    heading: string;
    growthRate?: { positive: boolean; number: string };
    number: string | number;
    onClick?: () => void;
    tooltipText?: string;
  }) => {
    return (
      <div
        onClick={onClick}
        className="bg-white p-6 border border-slate-200  rounded-lg"
      >
        <div className="flex flex-col">
          <div
            className={`${styles.cardHeading} truncate cursor-default gap-2 items-center justify-start
           flex`}
          >
            {heading}{" "}
            {tooltipText && (
              <Tooltip color={colors.tooltip} title={tooltipText}>
                <Info />
              </Tooltip>
            )}
          </div>

          <div className="flex justify-between items-center cursor-default">
            <Skeleton
              paragraph={{ rows: 1 }}
              title={false}
              active
              loading={isFetchingDetails}
            >
              <div className={styles.cardDescription}>{number}</div>
              <div
                className="cursor-default"
                title={t("notification.monthlyResourcesPercentage", {
                  type: growthRate?.positive ? "more than" : "less than",
                })}
              >
                {growthRate ? (
                  <Tag
                    label={`${parseInt(growthRate.number)}%`}
                    icon={
                      growthRate?.positive ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                    tagType={growthRate?.positive ? "success" : "error"}
                  />
                ) : (
                  <></>
                )}
              </div>
            </Skeleton>
          </div>
        </div>
      </div>
    );
  };

  const detailCardContent = [
    {
      content: detailCard({
        heading: t("card.heading.hiredResources"),
        // growthRate: {
        //   positive:
        //     data?.totalHiredResources?.percentageChange < 0 ? false : true,
        //   number: data?.totalHiredResources?.percentageChange ?? 0,
        // },
        number: data?.totalHiredResources?.totalHiredResources ?? 0,
        onClick: () => navigate(ROUTES.HIRED_RESOURCES),
        // tooltipText: t("notification.monthlyResourcesPercentage"),
      }),
    },
    {
      content: detailCard({
        heading: t("card.heading.pendingInvoices"),
        number: `$${data?.pendingInvoices ?? 0}`,
        onClick: () => navigate(ROUTES.INVOICES),
      }),
    },
    {
      content: detailCard({
        heading: t("card.heading.pendingTimesheet"),
        number: data?.pendingTimesheetApprovals ?? 0,
      }),
    },
    {
      content: detailCard({
        heading: t("card.heading.totalHoursWorked"),
        number: `${data?.totalHoursWorked ?? 0}h`,
      }),
    },
  ];

  const navigate = useNavigate();
  const greeting = useSelector(getGreeting);

  useEffect(() => {
    if (userId)
      dispatch(
        RequestAppAction.handleGetDashboardTimesheetList({
          id: userId,
          data: { status: TIMESHEET_STATUS.PENDING },
        })
      );
  }, [userId]);

  const isFirstTime = async () => {
    await localStorageService.fetch("isFirstTime").then(async (res) => {
      if (!res) {
        //TODO: compare user id, if match don't show hire now card
        await localStorageService.persist("isFirstTime", userId);
        setShowHireNow(true);
      }
    });
  };

  const columns: any = [
    {
      title: t("table.column.candidate"),
      key: "resourceFirstName",
      dataIndex: "resourceFirstName",
      render: (name: string, record: { profilePicture: string }) => (
        <span>
          <Avatar>
            {record?.profilePicture ? (
              <img src={record.profilePicture} />
            ) : (
              name?.charAt(0)
            )}
          </Avatar>{" "}
          {name ? name?.split(" ")[0] : ""}
        </span>
      ),
    },
    {
      title: t("table.column.date"),
      key: "startTime",
      dataIndex: "startTime",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              weekday: "short",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.time"),
      key: "startTime",
      dataIndex: "startTime",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleTimeString("en-US", {
              minute: "2-digit",
              hour: "2-digit",
            })}
          </span>
        );
      },
    },

    {
      title: t("table.column.action"),
      key: "action",
      align: "start",
      render: (record: any) => (
        <div className="flex">
          <Button
            onClick={() => window.open(record.meetingLink, "_blank")}
            btn_class="transparent_btn"
            toolTipTitle={t("button.joinMeeting")}
            icon={
              <img
                className="w-6 h-6 rounded-full"
                src={require("../../assets/image/meet.png")}
              />
            }
          />
        </div>
      ),
    },
  ];

  const updatedInterviewList = Array.isArray(interviewListing)
    ? interviewListing.slice(0, 6)
    : [];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "7 Days",
    },
    {
      key: "2",
      label: "30 Days",
    },
    {
      key: "3",
      label: "3 Months",
      animated: true,
    },
    {
      key: "4",
      label: "12 Months",
    },
  ];
  const interviewItems: TabsProps["items"] = [
    {
      key: "1",
      label: "7 Days",
    },
    {
      key: "2",
      label: "15 Days",
    },
    {
      key: "3",
      label: "30 Days",
      animated: true,
    },
  ];

  const createLoadingColumn = (typeColoumn: any[], loading: boolean) => {
    return typeColoumn.map((col: any) => ({
      ...col,
      render: (value: any, record: any, index: number) =>
        loading ? (
          <Skeleton.Input active block />
        ) : (
          col.render?.(value, record, index) ?? value
        ),
    }));
  };

  const fillLoadingLoader = (
    loading: boolean,
    dataSourceType: any[],
    fill: number = 5
  ) => {
    return loading ? Array(fill).fill({}) : dataSourceType;
  };

  const InvoicesColumns: any = [
    {
      title: t("table.column.invoice"),
      key: "invoiceNumber",
      dataIndex: "invoiceNumber",
    },
    {
      title: t("table.column.payment"),
      key: "netAmount",
      dataIndex: "netAmount",
    },
    {
      title: t("table.column.issueDate"),
      key: "issueDate",
      dataIndex: "issueDate",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              weekday: "long",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.dueDate"),
      key: "dueDate",
      dataIndex: "dueDate",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              weekday: "long",
            })}
          </span>
        );
      },
    },

    {
      title: t("table.column.status"),
      key: "paymentStatus",
      dataIndex: "paymentStatus",
      render: (status: any) => (
        <>
          {status ? (
            <Tag
              label={status}
              tagType={
                typeof status === "string" ? status.toLowerCase() : undefined
              }
            />
          ) : (
            "-"
          )}
        </>
      ),
    },
  ];

  const timesheetColumns: any = [
    {
      title: t("table.column.startDate"),
      dataIndex: "startDate",
      key: "startDate",
      render: (val: any) => {
        return val ? <div>{returnDateOnly(val)}</div> : "-";
      },
    },
    {
      title: t("table.column.endDate"),
      dataIndex: "endDate",
      key: "endDate",
      render: (val: any) => {
        return val ? <div>{returnDateOnly(val)}</div> : "-";
      },
    },
    {
      title: t("table.column.totalAmount"),
      dataIndex: "totalMarginAmount",
      key: "totalMarginAmount",
      render: (val: any) => {
        return val;
      },
    },
    {
      title: t("table.column.totalHours"),
      dataIndex: "totalHours",
      key: "totalHours",
      render: (val: any) => {
        return val;
      },
    },
    {
      title: t("table.column.fixedAmount"),
      dataIndex: "fixedAmount",
      key: "fixedAmount",
      render: (val: any) => {
        return val ? "true" : "false";
      },
    },
    {
      title: t("table.column.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: any) => {
        return val ? returnDateYear(val) : "-";
      },
    },
    {
      title: t("table.column.status"),
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        return (
          <Tag
            label={status}
            tagType={
              typeof status === "string" ? status.toLowerCase() : undefined
            }
          />
        );
      },
    },
  ];

  const [selecetedTable, setSelectedTable] = useState("1");
  const itemsTable: TabsProps["items"] = [
    {
      key: "1",
      label: t("heading.invoices"),
    },
    {
      key: "2",
      label: t("heading.timesheet"),
    },
  ];

  const updatedTimesheetList = Array.isArray(timesheetListing)
    ? timesheetListing?.slice(0, 7)
    : []; //list of Timesheet including only 7
  const updatedInvoicesList = Array.isArray(invoicesListing)
    ? invoicesListing?.slice(0, 5)
    : []; //list of invoices including only 5

  return (
    <PrivatePageTemplate
      title={t(`heading.greeting`, {
        greeting,
        name: username?.firstName ?? "",
      })}
      buttons={[
        {
          onClick: () => {
            navigate(ROUTES.HIRENOW);
          },
          label: t("button.hireNow"),
          icon: <AddUser />,
        },
      ]}
    >
      {showHireNow && <Card style={styles.cardStyle} childern={cardContent} />}
      <Card style={styles.detailCardStyle} childern={detailCardContent} />
      <div className="grid grid-cols-7 gap-5">
        <div className="col-span-4 p-5 bg-white border rounded-xl gap-5">
          <div>
            <div className={styles.title}>
              {t("labels.resourceOnboadingAnalysis")}
              <Divider />
            </div>
            <div>
              <div className="flex gap-4">
                <Tabs
                  defaultActiveKey="1"
                  items={items}
                  onChange={(key: string) => {
                    if (!isFetchingHiredResource) handleTimelineChange(key);
                  }}
                />
              </div>

              <Spin spinning={isFetchingHiredResource}>
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="area"
                  height={275}
                />
              </Spin>
            </div>
          </div>
        </div>
        <div className="col-span-3 p-5 bg-white border rounded-xl gap-5">
          <div>
            <div className={styles.title}>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center justify-start">
                  <div className="pb-1">{t("heading.UpcomingInterviews")}</div>
                  {/* <Tag
                    upperCase={false}
                    tagType="pending"
                    label={t("heading.countThisWeek", {
                      count: data?.upCommingInterviews ?? 0,
                    })}
                  /> */}
                </div>
                <div>
                  <Button
                    label={t("button.viewAll")}
                    btn_class="white_btn"
                    onClick={() => navigate(ROUTES.INTERVIEW)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Tabs
                defaultActiveKey="1"
                items={interviewItems}
                onChange={(key: string) => {
                  handleInterviewTimelineChange(key);
                }}
              />
              <Table
                size="small"
                pagination={false}
                dataSource={fillLoadingLoader(
                  isFetchingInterviewList,
                  updatedInterviewList,
                  5
                )}
                columns={createLoadingColumn(columns, isFetchingInterviewList)}
                loading={false}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-9 gap-5">
        <div className="col-span-6 p-5 bg-white border rounded-xl gap-5">
          <div>
            <div className={styles.title}>
              {t("heading.invoices&timesheet")}
            </div>
            <div className="flex gap-5">
              <div className="col-span-2 ">
                <div className="flex gap-4 mb-5">
                  <Tabs
                    defaultActiveKey="1"
                    items={itemsTable}
                    onChange={(val) => {
                      setSelectedTable(val);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <Table
                columns={createLoadingColumn(
                  selecetedTable === "2" ? timesheetColumns : InvoicesColumns,
                  isFetchingInvoices
                )}
                pagination={false}
                size="large"
                dataSource={
                  isFetchingInvoices || isFetchingTimesheet
                    ? Array(5).fill({})
                    : selecetedTable === "2"
                    ? updatedTimesheetList
                    : updatedInvoicesList
                }
              />
            </div>
            {/* <Spin spinning={isFetchingProjectChart}>
              <Chart
                options={barChartData.options}
                series={barChartData.series}
                type="bar"
                height={485}
              />
            </Spin> */}
          </div>
        </div>
        <div className="col-span-3 gap-4  flex flex-col ">
          <div className="p-5 bg-white border rounded-xl gap-5">
            <div className={styles.title}>
              <div className="flex gap-3 items-center justify-between">
                <div className="pb-1">{t("heading.masterwork")}</div>
              </div>
              <div>
                <Tabs
                  defaultActiveKey="1"
                  items={items}
                  onChange={(val: string) => {
                    if (!isFetchingTimeline) handleTimelineChartChange(val);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center items-start">
              <Spin spinning={isFetchingTimeline}>
                {topPerformersNotFound ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <Chart
                    options={totalHoursChartData.options}
                    series={totalHoursChartData.series}
                    type="pie"
                    height={160}
                  />
                )}
              </Spin>
            </div>
          </div>
          <div className="p-5 bg-white border h-2/3 rounded-xl gap-5">
            <div className={styles.title}>
              <div className="flex gap-3 items-center justify-start">
                <div className="pb-1">{t("heading.resourceBreakdown")}</div>
              </div>
              <Divider />
            </div>
            <div className="flex justify-center items-center">
              <Spin spinning={isFetchingDetails}>
                {resourceBreakdownNotFound ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <Chart
                    options={resourcesTypeChartData.options}
                    series={resourcesTypeChartData.series}
                    type="pie"
                    height={160}
                  />
                )}
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </PrivatePageTemplate>
  );
};
