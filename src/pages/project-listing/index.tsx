import { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { Edit, Plus } from "src/assets";
import { Button, Table, TableSearch, Tag } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import {
  getProjectList,
  getProjectListMeta,
  projectLoading,
} from "src/store/selectors/features/project-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { formatToMonthYear } from "src/utils/date.util";
import { PROJECT_STATUS } from "src/utils/enum";
interface props {
  title: string;
}

interface query {
  page?: number;
  search?: string;
  projectStatus?: PROJECT_STATUS | "all";
}
export const ProjectListing: React.FC<props> = ({ title }: props) => {
  const { t } = useTranslation();
  const list = useSelector(getProjectList);
  const meta = useSelector(getProjectListMeta);
  const isLoading = useSelector(projectLoading);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<PROJECT_STATUS | "all">("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleGetProject = ({ page = 1, search, projectStatus }: query) => {
    const query: query = {
      page,
      search,
    };

    if (projectStatus !== "all") {
      query.projectStatus = projectStatus;
    }
    dispatch(RequestAppAction.handleGetProject({ query }));
  };

  const onChangePage = ({ pageNumber }: { pageNumber: number }) => {
    const query: query = {
      page: pageNumber,
      search,
    };

    if (selectedTab !== "all") {
      query.projectStatus = selectedTab;
    }
    dispatch(
      RequestAppAction.handleGetProject({
        query,
        cbSuccess: () => setPage(pageNumber),
      })
    );
  };

  useEffect(() => {
    handleGetProject({});
  }, []);

  const changeTab = (tab: any) => {
    const query: query = {
      page,
      search,
    };

    if (tab !== "all") {
      query.projectStatus = tab;
    }
    dispatch(
      RequestAppAction.handleGetProject({
        query,
        cbSuccess: () => {
          setSelectedTab(tab);
        },
      })
    );
  };

  const columns: ColumnType[] = [
    {
      title: <span className="ms-5">{t("table.column.name")}</span>,
      key: "name",
      dataIndex: "name",
      render: (val: string) => <span className="ms-5">{val}</span>,
    },
    {
      title: t("table.column.startDate"),
      key: "startDate",
      dataIndex: "startDate",
      render: (startDate: Date) => <span>{formatToMonthYear(startDate)}</span>,
    },
    {
      title: t("table.column.endDate"),
      key: "endDate",
      dataIndex: "endDate",
      render: (endDate: Date) => <span>{formatToMonthYear(endDate)}</span>,
    },
    {
      title: t("table.column.resources"),
      key: "resources",
      dataIndex: "resources",
      render: (resources: []) => <span>{resources.length}</span>,
    },
    {
      title: t("table.column.status"),
      key: "status",
      dataIndex: "status",
      render: (status: any) => (
        <Tag
          label={status}
          tagType={
            status === "Not started"
              ? "notstarted"
              : status?.toString()?.toLowerCase()
          }
        />
      ),
    },
    {
      width: 250,
      title: t("table.column.action"),
      key: "action",
      render: (record: any, item: any) => (
        <>
          <Button
            disabled={item?.status === PROJECT_STATUS.COMPLETED}
            onClick={() => handleOpenUpdateProject(record)}
            icon={<Edit />}
            btn_class="transparent_btn"
            toolTipTitle={
              item?.status === PROJECT_STATUS.COMPLETED
                ? undefined
                : t("labels.update")
            }
          />
        </>
      ),
    },
  ];

  const handleOpenCreateProject = () => {
    navigate(ROUTES.CREATE_PROJECT);
  };
  const handleOpenUpdateProject = (record: any) => {
    const path = generatePath(
      ROUTES.UPDATE_PROJECT.replace(":id", record.name)
    );

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const onChangeStatus = (val: PROJECT_STATUS | "all") => {
    setPage(1);
    const query: query = {
      page: 1,
      search,
    };

    if (val !== "all") {
      query.projectStatus = val;
    }
    dispatch(
      RequestAppAction.handleGetProject({
        query,
        cbSuccess: () => {
          setSelectedTab(val);
        },
      })
    );
  };

  const filters = [
    {
      value: t("labels.all"),
      label: t("labels.all"),
      id: 0,
      onClick: () => {
        onChangeStatus("all");
      },
    },
    {
      value: t("labels.onGoingProjects"),
      label: t("labels.onGoingProjects"),
      id: 1,
      onClick: () => {
        onChangeStatus(PROJECT_STATUS.ON_GOING);
      },
    },
    {
      value: PROJECT_STATUS.NOT_STARTED,
      label: PROJECT_STATUS.NOT_STARTED,
      id: 2,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
    {
      value: PROJECT_STATUS.COMPLETED,
      label: PROJECT_STATUS.COMPLETED,
      id: 3,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
  ];

  return (
    <PrivatePageTemplate
      title={title}
      description={t("messages.projectList")}
      buttons={[
        {
          onClick: handleOpenCreateProject,
          label: t("button.createProject"),
          icon: <Plus />,
        },
      ]}
    >
      <TableSearch
        filters={filters}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
          handleGetProject({
            search: val,
            page: 1,
            projectStatus: selectedTab,
          });
        }}
      />
      <Table
        columns={columns}
        dataSource={list ?? []}
        heightAdjuster={20}
        loading={isLoading}
        pagination={{
          current: page,
          total: meta?.totalCount,
          onChange: (val: number) => {
            onChangePage({ pageNumber: val });
          },
        }}
      />
    </PrivatePageTemplate>
  );
};
