import { Avatar, Spin } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { Edit } from "src/assets";
import { Button, Table, TableSearch, Tag } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import { favoriteResourcesLoading } from "src/store/selectors/features/favorite-selector";
import {
  getInterviewList,
  getInterviewMeta,
  interviewLoading,
} from "src/store/selectors/features/interview-selector";
import { getUserId } from "src/store/selectors/features/login-selector";
import { resourcesLoading } from "src/store/selectors/features/resources-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { INTERVIEW_STATUS } from "src/utils/enum";
import { formatDisplayName } from "src/utils/formatName";

interface props {
  title: string;
}

interface data {
  page?: number;
  search?: string;
  userId: string;
  status?: INTERVIEW_STATUS;
}
export const InterviewListing = ({ title }: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useSelector(getInterviewList);
  const metaInterview: any = useSelector(getInterviewMeta);
  const loadingResource = useSelector(resourcesLoading);
  const userId = useSelector(getUserId);
  const loadingInterview = useSelector(interviewLoading);
  const loadingFavorite = useSelector(favoriteResourcesLoading);
  const dispatch = useDispatch();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<"all" | INTERVIEW_STATUS>(
    "all"
  );
  const [search, setSearch] = useState("");

  const handleGetInterviewListing = ({
    page = 1,
    search,
  }: {
    page?: number;
    search?: string;
  }) => {
    const data = {
      page,
      search,
      userId,
    };
    dispatch(RequestAppAction.handleGetInterviewListing({ data }));
  };

  useEffect(() => {
    handleGetInterviewListing({});
  }, []);

  const onUpdate = (record: {
    resourceName: string;
    id: string;
    resourceId: string;
    timeZone: string;
  }) => {
    const path = generatePath(
      ROUTES.UPDATE_INTERVIEW.replace(":id", record.id) +
        `?timezone=${record.timeZone}`
    );

    navigate(path, {
      state: {
        data: { ...record, id: record?.resourceId, update: true },
      },
    });
  };

  const columns: any = [
    {
      title: <span className="ms-5">{t("table.column.resourceName")}</span>,
      key: "resourceFirstName",
      dataIndex: "resourceFirstName",
      render: (
        name: string,
        record: { profilePicture: string; resourceLastName: string }
      ) => (
        <span className="ms-5">
          <Avatar>
            {record?.profilePicture ? (
              <img src={record.profilePicture} />
            ) : (
              name?.charAt(0)
            )}
          </Avatar>{" "}
          {formatDisplayName(name, record?.resourceLastName)}
        </span>
      ),
    },
    {
      title: t("table.column.timezone"),
      dataIndex: "timezone",
      key: "timezone",
      render: (timezone: any) => <>{timezone}</>,
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
              weekday: "long",
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
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        );
      },
    },

    {
      title: t("table.column.status"),
      key: "status",
      dataIndex: "status",
      render: (status: any) => (
        <>
          {status ? (
            <Tag
              label={status === INTERVIEW_STATUS.BOOKED ? "Scheduled" : status}
              tagType={status?.toString()?.toLowerCase()}
            />
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: t("table.column.action"),
      key: "action",
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
          <Button
            disabled={record?.status !== "Booked"}
            onClick={() => onUpdate(record)}
            btn_class="transparent_btn"
            icon={<Edit />}
            toolTipTitle={t("button.update")}
          />
        </div>
      ),
    },
  ];

  const onClickRow = (record: any) => {
    // TODO: on click show interview details in future
    return record;
  };

  const changeTab = (tab: "all" | INTERVIEW_STATUS) => {
    setPage(1);
    const data: data = {
      page: 1,
      search,
      userId,
    };
    if (tab !== "all") {
      data.status = tab;
    }

    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data,
        cbSuccess: () => {
          setSelectedTab(tab);
        },
      })
    );
  };

  const onChangePage = (val: number) => {
    const data: data = {
      page: val,
      search,
      userId,
    };
    if (selectedTab !== "all") {
      data.status = selectedTab;
    }

    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data,
        cbSuccess: () => {
          setPage(val);
        },
      })
    );
  };

  const onSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    const data: data = {
      page: 1,
      search: val,
      userId,
      status: selectedTab !== "all" ? selectedTab : undefined,
    };

    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data,
      })
    );
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
      value: INTERVIEW_STATUS.BOOKED,
      label: "scheduled",
      id: 1,
      onClick: (val: INTERVIEW_STATUS) => {
        changeTab(val);
      },
    },
    {
      value: INTERVIEW_STATUS.DONE,
      label: INTERVIEW_STATUS.DONE,
      id: 2,
      onClick: (val: INTERVIEW_STATUS) => {
        changeTab(val);
      },
    },
  ];

  return (
    <Spin spinning={loadingFavorite || loadingResource}>
      <PrivatePageTemplate
        title={title}
        description={t("interview.listInterview")}
      >
        <TableSearch filters={filters} onSearch={onSearch} />
        <Table
          loading={loadingInterview || loadingResource}
          columns={columns}
          dataSource={data ?? []}
          pagination={{
            onChange: onChangePage,
            total: metaInterview?.totalCount,
            current: page,
          }}
          heightAdjuster={20}
          handleRowClick={onClickRow}
        />
      </PrivatePageTemplate>
    </Spin>
  );
};
