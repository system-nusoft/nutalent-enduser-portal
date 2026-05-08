import { Spin, Switch } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { Button, Table, TableSearch, Tag } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { limit } from "src/store/Endpoints";
import { getConfigurationData } from "src/store/selectors/features/configuration-selector";
import { getLoginData } from "src/store/selectors/features/login-selector";
import {
  getTimesheetList,
  gettimesheetMeta,
  timesheetLoading,
} from "src/store/selectors/features/timesheet-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { TIMESHEET_STATUS } from "src/utils/enum";
import styles from "./styles.module.scss";

interface props {
  title: string;
}

interface query {
  page: number;
  limit?: number;
  search?: string | null | undefined;
  status?: TIMESHEET_STATUS | null;
}

export const TimeSheet = ({}: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const data = useSelector(getTimesheetList);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pathname = location.pathname;
  const match = pathname.match(/engagements\/([^/]+)/);
  const id = match ? match[1] : null;
  const isFetching = useSelector(timesheetLoading);
  const [isLoading, setIsLoading] = useState(true);
  const meta = useSelector(gettimesheetMeta);
  const configuration: any = useSelector(getConfigurationData);
  const [automatilcalyApprove, setAutomaticallyApprove] = useState(false);
  const [isFetchingConfiguration, setIsFetchingConfiguration] = useState(false);
  const user: any = useSelector(getLoginData);

  useEffect(() => {
    if (configuration && configuration["Auto Approve Timesheet"] === "true") {
      setAutomaticallyApprove(true);
    }
  }, [configuration]);

  const [selectedTab, setSelectedTab] = useState<TIMESHEET_STATUS | "all">(
    "all"
  );

  const columns: any = [
    {
      title: <span className="ms-5">{t("table.column.startDate")}</span>,
      key: "startDate",
      dataIndex: "startDate",
      render: (val: string | null | undefined) => {
        if (!val) return <span className="ms-5">-</span>;
        
        const date = new Date(val);
        if (isNaN(date.getTime())) return <span className="ms-5">-</span>;
        
        return (
          <span className="ms-5">
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.endDate"),
      key: "endDate",
      dataIndex: "endDate",
      render: (val: string | null | undefined) => {
        if (!val) return <span>-</span>;
        
        const date = new Date(val);
        if (isNaN(date.getTime())) return <span>-</span>;
        
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.totalAmount"),
      key: "totalMarginAmount",
      dataIndex: "totalMarginAmount",
    },
    {
      title: t("table.column.totalHours"),
      key: "totalHours",
      dataIndex: "totalHours",
    },
    {
      title: t("table.column.fixedAmount"),
      key: "fixxeAmount",
      dataIndex: "fixxeAmount",
      render: (val: string) => {
        return <span>{val ? "true" : "false"}</span>;
      },
    },
    {
      title: t("table.column.createdAt"),
      key: "createdAt",
      dataIndex: "createdAt",
      render: (val: string | null | undefined) => {
        if (!val) return <span>-</span>;
        
        const date = new Date(val);
        if (isNaN(date.getTime())) return <span>-</span>;
        
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.status"),
      key: "status",
      dataIndex: "status",
      render: (status: string | null | undefined) => (
        <>
          {status ? (
            <Tag label={status} tagType={status?.toString()?.toLowerCase()} />
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: t("table.column.action"),
      key: "action",
      render: (_: unknown, record: { id?: string | null }) => (
        <>
          <Button
            onClick={() => record?.id && onClickRow(record)}
            btn_class="transparent_btn"
            label={t("button.viewTimesheet")}
            disabled={!record?.id}
          />
        </>
      ),
    },
  ];

  const onClickRow = (record: { id?: string | null }) => {
    if (!record?.id) return;
    
    const path = generatePath(`${record.id}`);

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const filters = [
    {
      value: t("labels.all"),
      label: t("labels.all"),
      id: 0,
      onClick: () => {
        changeTab("all");
      },
    },
    {
      value: TIMESHEET_STATUS.APPROVED,
      label: TIMESHEET_STATUS.APPROVED,
      id: 1,
      onClick: () => {
        changeTab(TIMESHEET_STATUS.APPROVED);
      },
    },
    {
      value: TIMESHEET_STATUS.PENDING,
      label: TIMESHEET_STATUS.PENDING,
      id: 2,
      onClick: () => {
        changeTab(TIMESHEET_STATUS.PENDING);
      },
    },
    {
      value: TIMESHEET_STATUS.REVISION,
      label: TIMESHEET_STATUS.REVISION,
      id: 3,
      onClick: () => {
        changeTab(TIMESHEET_STATUS.REVISION);
      },
    },
  ];

  const changeTab = (tab: TIMESHEET_STATUS | "all") => {
    setPage(1);
    const data: query = {
      page: 1,
      search,
    };

    if (tab !== "all") {
      data.status = tab;
      //TODO for completed status search
    }
    onFetchData(data, () => setSelectedTab(tab));
  };

  const onChangePage = (val: number) => {
    const data: query = {
      page: val,
      search,
    };

    if (selectedTab !== "all") {
      data.status = selectedTab;
      //TODO for completed status search
    }
    onFetchData(data, () => setPage(val));
  };

  const onFetchData = (query: query, cbSuccess?: () => void) => {
    if (id)
      dispatch(
        RequestAppAction.handleGetTimesheetListing({
          id: id,
          query: { 
            page: query.page,
            limit: query.limit,
            search: query.search || undefined,
            status: query.status || undefined
          },
          cbSuccess: () => {
            cbSuccess && cbSuccess();
          },
        })
      );
  };
  const onSearch = (val: string) => {
    setPage(1);
    setSearch(val);
    const data: query = {
      page: 1,
      search: val,
    };

    if (selectedTab !== "all") {
      data.status = selectedTab;
      //TODO for completed status search
    }

    onFetchData(data);
  };

  useEffect(() => {
    if (id)
      dispatch(
        RequestAppAction.handleGetTimesheetListing({
          id: id,
          query: { page: page, limit: limit },
          cbSuccess: () => {
            setIsLoading(false);
          },
        })
      );
  }, []);

  const onSwitchTimesheetApprove = () => {
    setIsFetchingConfiguration(true);
    if (user?.userId) {
      dispatch(
        RequestAppAction.handlePostConfiguration({
          data: {
            value: `${!automatilcalyApprove}`,
            key: "Auto Approve Timesheet",
          },
          id: user?.userId,
          cbSuccess: () => {
            setIsFetchingConfiguration(false);
            setAutomaticallyApprove(!automatilcalyApprove);
          },
          cbFailure: () => {
            setIsFetchingConfiguration(false);
          },
        })
      );
    }
  };

  return (
    <Spin spinning={false}>
      <PrivatePageTemplate title={"Timesheets"}>
        <div className="flex  justify-end">
          <div className="flex gap-2 items-start mt-2">
            <div className={styles.switch_text}>
              {t("labels.AutomaticallyApproveTimesheets")}
            </div>
            <Switch
              loading={isFetchingConfiguration}
              title="automatilcaly"
              onChange={onSwitchTimesheetApprove}
              value={automatilcalyApprove}
            />
          </div>
        </div>

        <TableSearch
          filters={filters}
          loading={isFetching || isLoading}
          onSearch={onSearch}
        />
        <Table
          loading={isFetching || isLoading}
          columns={columns}
          dataSource={Array.isArray(data) ? data : []}
          pagination={{
            onChange: onChangePage,
            total: meta?.totalCount,
            current: page,
          }}
          handleRowClick={onClickRow}
        />
      </PrivatePageTemplate>
    </Spin>
  );
};
