import { Spin, Tooltip } from "antd";
import Table from "antd/es/table";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Notification, Tag } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import {
  getInvoicesData,
  invoicesLoading,
} from "src/store/selectors/features/invoices-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/utils/colors";
import { INVOICES_STATUS, modalProps } from "src/utils/enum";
import { returnDateYear } from "src/utils/functions";
import styles from "./styles.module.scss";

import { ExportOutlined } from "@ant-design/icons";
interface props {}

export const InvoiceById = ({}: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modalRefSuccess = useRef<modalProps>(null);
  const data: any = useSelector(getInvoicesData);
  const location = useLocation();
  const isLoading = useSelector(invoicesLoading);
  const match = location.pathname.match(/invoices\/([^/]+)/);
  const id = match ? match[1] : null;
  const dispatch = useDispatch();

  const onFetchData = () => {
    if (id)
      dispatch(
        RequestAppAction.handleGetInvoicesById({
          id: id,
          cbFailure: () => {
            navigate(ROUTES.INVOICES);
          },
        })
      );
  };

  useEffect(() => {
    onFetchData();
  }, []);

  const columns: any[] = [
    {
      title: t("table.column.timeline"),
      key: "startDate",
      dataIndex: "startDate",
      render: (
        name: string,
        record: { endDate: string; id: string; engagementId: string }
      ) => {
        const date = new Date(name);
        return (
          <span className="flex gap-1">
            {name && record
              ? `From ${date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })} To ${new Date(record.endDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}`
              : "-"}
            <Tooltip color={colors.tooltip} title={t("heading.viewTimesheet")}>
              <ExportOutlined
                className="font-bold cursor-pointer"
                onClick={() =>
                  navigate(
                    ROUTES.VIEW_INVOICE_TIMESHEET.replace(
                      ":id",
                      record?.id
                    ).replace(":engId", record?.engagementId)
                  )
                }
              />
            </Tooltip>
          </span>
        );
      },
    },
    {
      title: t("table.column.endDate"),
      key: "endDate",
      dataIndex: "endDate",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {name
              ? date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </span>
        );
      },
    },
    {
      title: t("table.column.totalHours"),
      key: "totalHours",
      dataIndex: "totalHours",
    },
    {
      title: t("table.column.approvedAt"),
      key: "approvedAt",
      dataIndex: "approvedAt",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {name
              ? date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  weekday: "long",
                })
              : "-"}
          </span>
        );
      },
    },
    {
      title: t("table.column.amount"),
      key: "totalMarginAmount",
      dataIndex: "totalMarginAmount",
      width: 120,
    },
  ];

  const ConfirmPayment = () => {
    dispatch(
      RequestAppAction.handlePatchInvoice({
        data: { status: "Confirmation Pending" },
        id: data?.id,
        cbSuccess: () => {
          Notification({ message: t("labels.success") });
          navigate(ROUTES.INVOICES);
        },
      })
    );
  };
  return (
    <Spin spinning={isLoading}>
      <PrivatePageTemplate>
        <div className="px-4">
          <div className="white-container max-h-[80vh]  flex flex-col gap-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className={styles.card_heading}>
                  {data?.invoiceNumber}{" "}
                  <Tag label={data?.paymentStatus} tagType="pending" />
                </div>
                <div className={styles.card_desc}>
                  {t("labels.paymentFor", {
                    startDate:
                      Array.isArray(data?.Timesheet) &&
                      data?.Timesheet?.length > 0
                        ? returnDateYear(`${data?.Timesheet[0]?.startDate}`)
                        : "-", // update in future
                    endDate:
                      data?.Timesheet?.length > 0
                        ? returnDateYear(
                            `${
                              data?.Timesheet[data?.Timesheet?.length - 1]
                                ?.endDate
                            }`
                          )
                        : "-", // update in future
                  })}
                </div>
              </div>
              <div>
                {data?.paymentStatus === INVOICES_STATUS.PENDING ? (
                  <Button
                    onClick={ConfirmPayment}
                    btn_class="full_btn"
                    label={t("button.confirmPayment")}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex gap-40">
              <div className="flex flex-col">
                <div className={styles.card_desc}>{t("labels.issueDate")}</div>
                <div className={styles.card_date}>
                  {data?.issueDate ? returnDateYear(`${data?.issueDate}`) : "-"}
                </div>
              </div>
              <div className="flex flex-col">
                <div className={styles.card_desc_brown}>
                  {t("labels.dueDate")}
                </div>
                <div className={styles.card_date}>
                  {data?.dueDate ? returnDateYear(`${data?.dueDate}`) : "-"}
                </div>
              </div>
            </div>
            <Table
              dataSource={data?.Timesheet ?? []}
              columns={columns}
              scroll={{ y: `calc(100vh - 32rem)` }}
              pagination={false}
              loading={false}
            />
            <div className="flex justify-end items-center gap-6 ">
              <div className={styles.card_desc}>{t("labels.totalAmount")}:</div>
              <div className={styles.card_amount}>${data?.netAmount}</div>
            </div>
          </div>
        </div>

        {/*
        future use for Adding bonus
        <DialogBox ref={modalRefSuccess}>
          <div className="flex">
            <span className={styles.alert_icon}>
              <TickGreen />
            </span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className={styles.modal_heading}>{t("labels.addBonus")}</div>
            <div className={`${styles.modal_desc}`}>
              {t("labels.addBonusDesc")}
            </div>
          </div>
          <div className="">
            <Input name="amount" label={t("labels.amount")} />
          </div>

          <div className="flex w-full mt-8 gap-5">
            <Button btn_class="white_full_btn" label={t("button.cancel")} />
            <Button btn_class="full_btn" label={t("button.addBonus")} />
          </div>
        </DialogBox> */}
      </PrivatePageTemplate>
    </Spin>
  );
};
