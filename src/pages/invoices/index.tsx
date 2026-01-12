import { Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { Info } from "src/assets";
import { Button, Table, TableSearch, Tag } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import { limit } from "src/store/Endpoints";
import {
  getInvoicesList,
  getInvoicesMeta,
} from "src/store/selectors/features/invoices-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/utils/colors";
import { INVOICES_STATUS } from "src/utils/enum";
import styles from "./styles.module.scss";

interface props {
  title: string;
}

interface data {
  page: number;
  limit?: number;
  search?: string | undefined;
  paymentStatus?: INVOICES_STATUS;
}
export const InvoicesListing = ({ title }: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useSelector(getInvoicesList);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const meta = useSelector(getInvoicesMeta);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<INVOICES_STATUS | "all">(
    "all"
  );

  const columns: any = [
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
              hour: "2-digit",
              minute: "2-digit",
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
              hour: "2-digit",
              minute: "2-digit",
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
      render: (_: undefined, record: { id: string }) => (
        <>
          <Button
            onClick={() => onClickRow(record)}
            btn_class="transparent_btn"
            label={t("button.viewInvoice")}
          />
        </>
      ),
    },
  ];

  const onFetchData = (query: data, cbSuccess?: () => void) => {
    dispatch(
      RequestAppAction.handleGetInvoices({
        query: { ...query },
        cbSuccess: () => {
          cbSuccess && cbSuccess();
        },
      })
    );
  };

  useEffect(() => {
    onFetchData({ page: page, limit: limit });
  }, []);

  const onClickRow = (record: { id: string }) => {
    const path = generatePath(ROUTES.INVOICEBYID.replace(":id", record.id));

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const onChangePage = (val: number) => {
    const query: data = {
      page,
      search,
    };

    if (selectedTab !== "all") {
      query.paymentStatus = selectedTab;
    }

    onFetchData(query, () => setPage(val));
  };

  const onSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    const query: data = {
      page: 1,
      search: val,
    };

    if (selectedTab !== "all") {
      query.paymentStatus = selectedTab;
    }
    onFetchData(query);
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
      value: INVOICES_STATUS.PENDING,
      label: "Awaiting payment",
      id: 1,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
    {
      value: INVOICES_STATUS.CONFIRMATION_PENDING,
      label: "Payment under review",
      id: 2,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
    {
      value: INVOICES_STATUS.PAID,
      label: INVOICES_STATUS.PAID,
      id: 3,
      onClick: (val: any) => {
        onChangeStatus(val);
      },
    },
  ];
  const onChangeStatus = (val: INVOICES_STATUS | "all") => {
    setPage(1);
    const query: data = {
      page: 1,
      search,
    };

    if (val !== "all") {
      query.paymentStatus = val;
    }

    onFetchData(query, () => setSelectedTab(val));
  };

  return (
    <Spin spinning={false}>
      <PrivatePageTemplate title={title}>
        <div className="flex items-center justify-end gap-6">
          <div className="p-4 bg-white rounded-xl w-full border px-6">
            <div className="flex gap-6 ">
              <div>
                <div className="flex flex-col gap-2">
                  <div
                    className={`flex gap-2 items-center ${styles.card_mini_heading}`}
                  >
                    {t("labels.pendingFunds")}{" "}
                    <Tooltip
                      color={colors.tooltip}
                      title={t("message.pendingFunds")}
                    >
                      <Info />
                    </Tooltip>
                  </div>
                  <div className={styles.card_desc}>
                    ${meta?.pendingMarginAmount ? meta?.pendingMarginAmount : "0"}
                  </div>
                </div>
              </div>

              <div className="border border-l-2 border-t-0 border-b-0 border-r-0 ps-6">
                <div className="flex flex-col gap-2">
                  <div className={styles.card_mini_heading}>
                    {t("labels.invoicesPaid")}
                  </div>
                  <div className={styles.card_desc}>
                    ${meta?.paidMarginAmount ? meta?.paidMarginAmount : "0"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TableSearch filters={filters} onSearch={onSearch} />
        <Table
          loading={false}
          columns={columns}
          dataSource={data ?? []}
          pagination={{
            onChange: onChangePage,
            total: meta?.totalCount,
            current: page,
          }}
          heightAdjuster={20}
          handleRowClick={onClickRow}
        />
      </PrivatePageTemplate>
    </Spin>
  );
};
