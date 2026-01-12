import { BranchesOutlined } from "@ant-design/icons";
import { Avatar, Form, Space, Spin, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { AddUser, Info, Megaphone, MessageTextSqaure } from "src/assets";
import { Button, Input, Table, TableSearch, Tag } from "src/components";
import { DialogBox } from "src/components/modal/Modal";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import {
  favoriteResourcesLoading,
  getFavoriteResourcesData,
  getFavoriteResroucesList,
} from "src/store/selectors/features/favorite-selector";
import { messagesLoading } from "src/store/selectors/features/messages-selector";
import {
  getResroucesList,
  getResroucesMeta,
  resourcesLoading,
} from "src/store/selectors/features/resources-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleClearFavoriteResources } from "src/store/slices/features/favorite-resources";
import { toggleClearResources } from "src/store/slices/features/resources";
import { colors } from "src/utils/colors";
import { RESOURCE_STATUS } from "src/utils/enum";
import styles from "./styles.module.scss";
interface props {
  title: string;
}

interface query {
  page?: number;
  search?: string;
  availabilityStatus?: RESOURCE_STATUS;
}
export const ResourceListing = ({ title }: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useSelector(getResroucesList);
  const metaResource: any = useSelector(getResroucesMeta);
  const metaFavorite: any = useSelector(getFavoriteResourcesData);
  const favoriteResrouceList = useSelector(getFavoriteResroucesList);
  const loadingResource = useSelector(resourcesLoading);
  const loadingFavorite = useSelector(favoriteResourcesLoading);
  const dispatch = useDispatch();
  const modalRef = useRef<any>();
  const isSendingMessage = useSelector(messagesLoading);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(null);
  const [search, setSearch] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [selectedId, setSelectedId] = useState<null | string>(null);
  const location = useLocation();
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "All" | RESOURCE_STATUS
  >("All");

  const columns: any = [
    {
      title: <span className="ms-5">{t("table.column.name")}</span>,
      key: "firstName",
      dataIndex: "firstName",
      render: (
        name: string,
        record: { profilePicture: string; lastName: string }
      ) => (
        <span className="flex items-center gap-2 ms-5">
          {record?.profilePicture ? (
            <img
              src={record.profilePicture}
              className="object-contain h-8 w-8 rounded-full bg-slate-500"
            />
          ) : (
            <Avatar className="overflow-hidden">{name?.charAt(0)}</Avatar>
          )}
          {name + " " + record.lastName}
        </span>
      ),
    },
    {
      title: t("table.column.jobTitle"),
      key: "title",
      dataIndex: "title",
    },
    {
      title: t("table.column.status"),
      key: "availabilityStatus",
      dataIndex: "availabilityStatus",
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
  ];

  const onClickEngagements = (record: any) => {
    const path = generatePath(
      ROUTES.ENGAGEMENTS.replace(":id", record.id) // will send id in future in api integration
    );

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  if (selectedTab !== 1) {
    columns.push(
      {
        title: (
          <div className="flex gap-2 items-center justify-start">
            <span>{t("table.column.project")}</span>{" "}
            <span>
              <Tooltip color={colors.primary} title={t("message.emptyProject")}>
                <Info />
              </Tooltip>
            </span>
          </div>
        ),
        key: "project",
        dataIndex: "project",
        render: (text: any) => (
          <div className="text-nowrap text-ellipsis  overflow-hidden">
            <span>{text ? text : "-"}</span>
          </div>
        ),
      },
      {
        width: 250,
        title: t("table.column.action"),
        key: "action",
        render: (_: any, record: { id: string }) => (
          <Space onMouseEnter={(e) => e.stopPropagation()}>
            <Button
              icon={<Megaphone />}
              toolTipTitle={t("button.inquiry")}
              onClick={(e) => {
                e.stopPropagation();
                modalRef.current?.openModal();
                setSelectedId(record.id);
              }}
              btn_class="transparent_btn"
            />
            <Button
              icon={<BranchesOutlined className="icon-3" />}
              toolTipTitle={t("button.viewEngagements")}
              onClick={(e) => {
                e.stopPropagation();
                onClickEngagements(record);
              }}
              btn_class="transparent_btn"
            />
          </Space>
        ),
      }
    );
  }
  const onClickRow = (record: any) => {
    const path = generatePath(ROUTES.RESOURCEBYID.replace(":id", record.id));

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const tabs = [
    {
      id: 0,
      label: t("labels.bookedResources"),
      path: "#hire",
    },
    {
      id: 1,
      label: t("labels.favoriteResrouce"),
      path: "#favorite",
    },
  ];

  const fetchData = (query: query, cbSuccess?: () => void) => {
    if (selectedTab) {
      dispatch(
        RequestAppAction.handleGetFavoriteResrouces({
          query: query,
          cbSuccess: () => {
            cbSuccess && cbSuccess();
          },
        })
      );
    } else {
      dispatch(
        RequestAppAction.handleGetResources({
          query: query,
          cbSuccess: () => {
            cbSuccess && cbSuccess();
          },
        })
      );
    }
  };

  const onChangeStatus = (status: RESOURCE_STATUS | "All") => {
    const query: query = {
      page,
      search,
    };
    setAvailabilityStatus(status);
    if (status !== "All") {
      fetchData({
        ...query,
        availabilityStatus: status,
      });
    } else {
      fetchData({
        ...query,
      });
    }
  };

  const changeTab = (tab: any) => {
    setSelectedTab(tab);
    setPage(1);
    dispatch(toggleClearFavoriteResources());
    dispatch(toggleClearResources());
    const query: query = {
      page: 1,
      search,
    };
    setAvailabilityStatus("All");
    if (tab) {
      navigate(ROUTES.FAVORITE_RESOURCES);
      dispatch(
        RequestAppAction.handleGetFavoriteResrouces({
          query,
        })
      );
    } else {
      if (location.pathname.includes("resources")) {
        navigate(ROUTES.HIRED_RESOURCES);
      }
      dispatch(
        RequestAppAction.handleGetResources({
          query,
        })
      );
    }
  };

  const onChangePage = (val: number) => {
    const query: query = {
      page: val,
      search,
    };

    if (availabilityStatus !== "All")
      query["availabilityStatus"] = availabilityStatus;
    if (selectedTab) {
      dispatch(
        RequestAppAction.handleGetFavoriteResrouces({
          query,
          cbSuccess: () => {
            setPage(val);
          },
        })
      );
    } else {
      dispatch(
        RequestAppAction.handleGetResources({
          query,
          cbSuccess: () => {
            setPage(val);
          },
        })
      );
    }
  };

  const onSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    const query: query = {
      page: 1,
      search: val,
    };
    if (availabilityStatus !== "All")
      query["availabilityStatus"] = availabilityStatus;

    if (selectedTab) {
      dispatch(
        RequestAppAction.handleGetFavoriteResrouces({
          query,
        })
      );
    } else {
      dispatch(
        RequestAppAction.handleGetResources({
          query,
        })
      );
    }
  };

  const onInquire = (val: { message: string }) => {
    const { message } = val;
    if (selectedId)
      dispatch(
        RequestAppAction.handleSendMessage({
          data: {
            resourceId: selectedId,
            content: message,
            //sending Hello for now as it is required
          },
          cbSuccess() {
            modalRef.current?.closeModal();
            setTimeout(() => {
              navigate(ROUTES.INQUIRIES);
            }, 200);
          },
        })
      );
  };

  const [form] = useForm();

  const filters = [
    {
      value: t("status.all"),
      label: t("status.all"),
      id: 0,
      onClick: () => {
        onChangeStatus("All");
      },
    },
    {
      value: RESOURCE_STATUS.AVAILABLE,
      label: RESOURCE_STATUS.AVAILABLE,
      id: 1,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
    {
      value: RESOURCE_STATUS.BUSY,
      label: RESOURCE_STATUS.BUSY,
      id: 2,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
    {
      value: RESOURCE_STATUS.VACATION,
      label: RESOURCE_STATUS.VACATION,
      id: 3,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
  ];

  return (
    <PrivatePageTemplate
      title={title}
      tabs={{
        data: tabs,
        onClick: (id) => changeTab(id),
      }}
      description={t("resources.description")}
      buttons={[
        {
          onClick: () => {
            navigate(ROUTES.HIRENOWREPLACE);
          },
          label: t("button.hireNow"),
          icon: <AddUser fill={colors.white} />,
        },
      ]}
    >
      <TableSearch filters={filters} onSearch={onSearch} />
      <Table
        loading={loadingResource || loadingFavorite}
        columns={columns}
        dataSource={selectedTab === 0 ? data ?? [] : favoriteResrouceList ?? []}
        pagination={{
          current: page,
          onChange: onChangePage,
          total:
            selectedTab === 0
              ? metaResource?.totalCount
              : metaFavorite?.totalCount,
        }}
        heightAdjuster={20}
        handleRowClick={onClickRow}
      />
      <DialogBox
        onClose={() => (
          setDisabled(true),
          form.setFieldValue("message", null),
          setSelectedId(null)
        )}
        ref={modalRef}
      >
        <Spin spinning={isSendingMessage}>
          <div className="flex flex-col mt-5 gap-4">
            <div className="flex flex-col gap-2">
              <div
                className={`${styles.modal_heading} flex gap-2 items-center`}
              >
                <MessageTextSqaure /> {t("labels.sendAnInquiry")}
              </div>
              <div className={styles.modal_description}>
                {t("labels.sendAnInquiryDesc")}
              </div>
            </div>
            <Form form={form} onFinish={onInquire}>
              <Input
                name="message"
                inputType="textArea"
                size="small"
                onChange={() => {
                  if (form.getFieldValue("message")?.length > 0)
                    setDisabled(false);
                  else setDisabled(true);
                }}
                rules={[{ required: true, message: t("error.detailRequired") }]}
              />

              <div className="flex justify-between gap-2 mt-8">
                <Button
                  btn_class="white_full_btn"
                  onClick={() => modalRef.current?.closeModal()}
                  label={t("button.cancel")}
                />
                <Button
                  btn_class="full_width_btn"
                  btn_Type="submit"
                  disabled={disabled}
                  label={t("button.send")}
                />
              </div>
            </Form>
          </div>
        </Spin>
      </DialogBox>
    </PrivatePageTemplate>
  );
};
