import { ApiOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ClockSideBar } from "src/assets";
import { Button, Table, TableSearch, Tag } from "src/components";
import { DialogBox } from "src/components/modal/Modal";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import { limit } from "src/store/Endpoints";
import {
  getEngagementList,
  getEngagementLoading,
  getEngagementMeta,
} from "src/store/selectors/features/engagements-saga";
import RequestAppAction from "src/store/slices/app-actions";
import { ENGAGEMENTS_STATUS } from "src/utils/enum";
import { returnDateYear } from "src/utils/functions";
import styles from "./styles.module.scss";
interface props {}

interface query {
  page?: number;
  search?: string;
  hiringStatus?: ENGAGEMENTS_STATUS;
  limit?: number;
}
export const EngagementListing = ({}: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useSelector(getEngagementList);
  const meta: any = useSelector(getEngagementMeta);
  const isLoading = useSelector(getEngagementLoading);
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const match = pathname.match(/resources\/([^/]+)/);
  const id = match ? match[1] : null;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const modalRef: any = useRef(null);
  const [selectedTab, setSelectedTab] = useState<"all" | ENGAGEMENTS_STATUS>(
    "all"
  );

  const handleGetEngagements = (
    {
      page = 1,
      search,
    }: {
      page?: number;
      search?: string;
      hiringStatus?: ENGAGEMENTS_STATUS;
    },
    func?: () => void
  ) => {
    const data: query = {
      page,
      search,
      limit,
    };

    if (selectedTab !== "all") {
      data.hiringStatus = selectedTab;
    }
    if (id)
      dispatch(
        RequestAppAction.handleGetEngagements({ data, id: id, cbSuccess: func })
      );
  };

  useEffect(() => {
    handleGetEngagements({});
  }, []);

  const columns: any = [
    {
      title: <span className="ms-5">{t("table.column.name")}</span>,
      key: "resource",
      dataIndex: "resource",
      render: (resource: { firstName: string }) => (
        <span className="flex ms-5 items-center gap-2">
          {resource?.firstName}
        </span>
      ),
    },
    {
      title: t("table.column.projectKickoff"),
      key: "startedAt",
      dataIndex: "startedAt",
      render: (status: any) => <>{returnDateYear(status)}</>,
    },
    {
      title: t("table.column.status"),
      key: "hiringStatus",
      dataIndex: "hiringStatus",
      render: (status: any) => (
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
      title: t("table.column.projectendedAt"),
      key: "endedAt",
      dataIndex: "endedAt",
      render: (status: any) => <>{status ? returnDateYear(status) : "-"}</>,
    },
    {
      title: t("table.column.action"),
      key: "action",
      dataIndex: "action",
      render: (
        _: any,
        obj: { id: string; hiringStatus: ENGAGEMENTS_STATUS }
      ) => (
        <>
          <Button
            btn_class="transparent_btn"
            icon={<ClockSideBar />}
            toolTipTitle={t("button.viewTimeSheet")}
            onClick={() => {
              const path = ROUTES.VIEW_TIMESHEET_ENGAGEMENT.replace(
                ":engId",
                obj.id
              );
              navigate(path);
            }}
          />
          <Button
            btn_class="transparent_btn"
            icon={<ApiOutlined />}
            toolTipTitle={
              obj?.hiringStatus === ENGAGEMENTS_STATUS.ENDED
                ? undefined
                : t("button.closeEngagement")
            }
            disabled={obj?.hiringStatus === ENGAGEMENTS_STATUS.ENDED}
            onClick={() => {
              setEditItem({
                hiringStatus: ENGAGEMENTS_STATUS.ENDED,
                id: obj?.id,
              });
              modalRef.current?.openModal();
            }}
          />
        </>
      ),
    },
  ];
  const [editItem, setEditItem] = useState<{
    hiringStatus: ENGAGEMENTS_STATUS;
    id: string;
  } | null>(null);

  const onChangeEngagementStatus = () => {
    if (editItem) {
      dispatch(
        RequestAppAction.handlePatchEngagement({
          data: { hiringStatus: editItem?.hiringStatus },
          id: editItem?.id,
          cbSuccess: () => {
            modalRef.current?.closeModal();
            const query: query = {
              page,
              search,
              limit,
            };

            setEditItem(null);
            if (selectedTab !== "all") {
              query.hiringStatus = selectedTab;
            }

            handleGetEngagements({ ...query });
          },
        })
      );
    }
  };

  const onChangePage = (val: number) => {
    handleGetEngagements({ search: search, page: val }, () => setPage(val));
  };

  const onSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    handleGetEngagements({ search: val, page: 1 });
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
      value: ENGAGEMENTS_STATUS.ACTIVE,
      label: ENGAGEMENTS_STATUS.ACTIVE,
      id: 1,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
    {
      value: ENGAGEMENTS_STATUS.ENDED,
      label: ENGAGEMENTS_STATUS.ENDED,
      id: 2,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
  ];

  const onChangeStatus = (val: ENGAGEMENTS_STATUS | "all") => {
    setPage(1);
    const data: query = {
      page: 1,
      search,
      limit,
    };

    if (val !== "all") {
      data.hiringStatus = val;
    }
    if (id)
      dispatch(
        RequestAppAction.handleGetEngagements({
          data,
          id: id,
          cbSuccess: () => setSelectedTab(val),
        })
      );
  };

  return (
    <PrivatePageTemplate
      title={t("labels.engagements")}
      description={t("labels.engagementsDesc")}
    >
      <TableSearch filters={filters} onSearch={onSearch} />
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data ?? []}
        pagination={{
          onChange: onChangePage,
          total: meta?.totalCount,
          current: page,
        }}
        heightAdjuster={20}
      />
      <DialogBox
        onClose={() => {
          setEditItem(null);
        }}
        ref={modalRef}
      >
        <Spin spinning={isLoading}>
          <div className="flex flex-col gap-6 mt-2">
            <div className={styles.modal_heading}>
              {t("message.endEngagementHeading")}
            </div>
            <div className={styles.modal_desc}>
              {t("message.endEngagementParagraph")}
            </div>
          </div>

          <div className="flex justify-end gap-4 w-full my-6">
            <Button
              onClick={() => modalRef.current?.closeModal()}
              btn_class="white_btn"
              label={t("button.cancel")}
            />
            <Button
              btn_class="filled_btn"
              onClick={() => onChangeEngagementStatus()}
              label={t("button.continue")}
            />
          </div>
        </Spin>
      </DialogBox>
    </PrivatePageTemplate>
  );
};
