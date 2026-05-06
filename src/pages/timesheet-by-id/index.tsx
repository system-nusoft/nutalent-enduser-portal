import { Spin, Switch } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, TickGreen } from "src/assets";
import { Button, Input, Table, Tag } from "src/components";
import { DialogBox } from "src/components/modal/Modal";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import {
  getTimesheetData,
  timesheetLoading,
} from "src/store/selectors/features/timesheet-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { modalProps, TIMESHEET_STATUS } from "src/utils/enum";
import styles from "./styles.module.scss";
interface props {
  title: string;
}

interface data {
  page?: number;
  search?: string;
}
export const ViewTimesheet = ({}: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modalRefSuccess = useRef<modalProps>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const match = pathname.match(/timesheets\/([^/]+)/);
  const matchEngagementId = pathname.match(/engagements\/([^/]+)/);
  const matchResourceId = pathname.match(/resources\/([^/]+)/);
  const timesheetId = match ? match[1] : null;
  const resourceId = matchResourceId ? matchResourceId[1] : null;
  const timesheetData: any = useSelector(getTimesheetData);
  const isLoading = useSelector(timesheetLoading);
  const engagementsId = matchEngagementId ? matchEngagementId[1] : null;
  const dispatch = useDispatch();
  const [inputComments, setInputComments] = useState("");
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  useEffect(() => {
    dispatch(
      RequestAppAction.handleGetTimesheetById({
        id: timesheetId,
        cbSuccess: () => {
          setIsLoadingInitial(false);
        },
      })
    );
  }, [timesheetId, dispatch]);

  const columns: any = [
    {
      title: <span className="ms-5">{t("table.column.date")}</span>,
      key: "date",
      dataIndex: "date",
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
      title: t("table.column.hours"),
      key: "hours",
      dataIndex: "hours",
    },
    {
      title: t("table.column.amount"),
      key: "marginAmount",
      dataIndex: "marginAmount",
    },
    {
      title: t("table.column.workNotes"),
      key: "workNotes",
      dataIndex: "workNotes",
      render: (val: string | null | undefined) => {
        return <span>{val ? val : "-"}</span>;
      },
    },
  ];

  const modalRef = useRef<modalProps>(null);

  const onReject = () => {
    modalRef?.current?.openModal();
  };

  const buttons: any = [];

  if (timesheetData?.status === TIMESHEET_STATUS.PENDING && !isLoadingInitial) {
    buttons.push(
      {
        label: t("button.requestRevision"),
        onClick() {
          onReject();
        },
        btn_class: "white_btn",
      },
      {
        label: t("button.approveTimesheet"),
        onClick: () => {
          onApproveTimeSheet();
        },
      }
    );
  }

  const comments = Array?.isArray(timesheetData?.TimesheetRevision)
    ? timesheetData?.TimesheetRevision[0]?.comments
    : null;

  const onApproveTimeSheet = () => {
    dispatch(
      RequestAppAction.handlePutTimesheet({
        id: timesheetId,
        data: { status: TIMESHEET_STATUS.APPROVED },
        cbSuccess: () => {
          modalRefSuccess.current?.openModal();
          dispatch(
            RequestAppAction.handleGetTimesheetById({
              id: timesheetId,
              cbSuccess: () => {
                setIsLoadingInitial(false);
              },
            })
          );
        },
      })
    );
  };
  const onRequestRevision = () => {
    dispatch(
      RequestAppAction.handlePutTimesheet({
        id: timesheetId,
        data: { status: TIMESHEET_STATUS.REVISION, comments: inputComments },
        cbSuccess: () => {
          if (resourceId && engagementsId) {
            const path = ROUTES.VIEW_TIMESHEET.replace(
              ":id",
              resourceId
            ).replace(":engId", engagementsId);
            navigate(path);
          }
          // setIsLoadingInitial(true)
          dispatch(
            RequestAppAction.handleGetTimesheetById({
              id: timesheetId,
              cbSuccess: () => {
                setIsLoadingInitial(false);
              },
            })
          );
          modalRef.current?.closeModal();
        },
      })
    );
  };

  return (
    <Spin spinning={isLoading}>
      <PrivatePageTemplate
        backBtn
        buttons={!isLoading && buttons?.length > 0 ? buttons : false}
      >
        <div className="grid grid-cols-12 gap-4 max-h-[calc(100vh-200px)]">
          <>
            <div className="flex col-span-8 flex-col overflow-y-auto">
              <div className={`${styles.card_container}`}>
                <div className="py-5 px-4">
                  <div className="flex items-center gap-2">
                    <div className={styles.heading}>
                      {t("timesheet.type", {
                        name:
                          timesheetData?.firstName ??
                          "" + " " + (timesheetData?.lastName ?? ""),
                      })}
                    </div>
                    <div>
                      <Tag
                        label={timesheetData?.status}
                        tagType={timesheetData?.status}
                      />
                    </div>
                  </div>
                  <div className={styles.desc}>
                    {t("timesheet.date", {
                      startDate: dayjs(timesheetData?.startDate).format(
                        "MMM DD, YY"
                      ),
                      endDate: dayjs(timesheetData?.endDate).format(
                        "MMM DD, YY"
                      ),
                    })}
                  </div>
                </div>
                <Table
                  loading={false}
                  columns={columns}
                  pagination={false}
                  dataSource={
                    Array?.isArray(timesheetData?.TimesheetRevision)
                      ? timesheetData?.TimesheetRevision[0]?.details
                      : []
                  }
                />
              </div>
            </div>
          </>
          <>
            <div className="flex flex-col gap-3 grid-cols-4 col-span-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="white-container  w-full col-span-2">
                <div className="flex flex-col gap-2 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className={styles.switch_text}>
                        {t("labels.fixedAmount")}
                      </div>
                      <Switch value={timesheetData?.fixedAmount} disabled />
                    </div>
                    <div className="flex">
                      <div className={styles.card_heading}>
                        {t("labels.totalHours")}
                      </div>
                      <div className={styles.card_desc}>
                        {`:  ${timesheetData?.totalHours ?? ""}`}
                      </div>
                    </div>
                    <div className="flex">
                      <div className={styles.card_heading}>
                        {`${t("labels.totalAmount")}`}
                      </div>
                      <div className={styles.card_desc}>
                        {`: $${timesheetData?.totalMarginAmount ?? ""}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="white-container w-full col-span-2">
                <div className="flex  flex-col gap-2">
                  <div className={styles.card_heading_note}>
                    {t("timesheet.noteFrom", {
                      name: timesheetData?.firstName ?? "",
                    })}
                  </div>
                  <div
                    className={`max-h-[5rem] min-h-[3rem] overflow-auto ${styles.card_desc}`}
                  >
                    {Array?.isArray(timesheetData?.TimesheetRevision)
                      ? timesheetData?.TimesheetRevision[0]?.notes
                      : ""}
                  </div>
                </div>
              </div>
              {comments ? (
                <div className="white-container w-full col-span-2">
                  <div className="flex  flex-col gap-2">
                    <div className={styles.card_heading}>
                      {t("labels.commentsFrom", {
                        name:
                          timesheetData?.firstName ??
                          "" + " " + (timesheetData?.lastName ?? ""),
                      })}
                    </div>
                    <div
                      className={`max-h-[5rem] min-h-[3rem] overflow-auto ${styles.card_desc}`}
                    >
                      {comments}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="white-container  w-full col-span-2">
                <div className="flex flex-col gap-2 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className={styles.switch_text}>
                        {t("labels.revisions")}{" "}
                        {`:  ${
                          Array.isArray(timesheetData?.TimesheetRevision) &&
                          timesheetData?.TimesheetRevision[0]?.revision
                            ? timesheetData?.TimesheetRevision[0]?.revision
                            : ""
                        }`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

{Array.isArray(timesheetData?.TimesheetRevision) && 
                timesheetData?.TimesheetRevision.length > 0 && 
                timesheetData?.TimesheetRevision[0]?.taskSummary?.trim() && (
                <div className="white-container w-full col-span-2">
                  <div className="flex flex-col gap-2">
                    <div className={styles.card_heading}>
                      {t("labels.taskSummary")}
                    </div>
                    <div className={`max-h-[10rem] min-h-[3rem] overflow-auto ${styles.card_desc}`}>
                      {timesheetData?.TimesheetRevision[0]?.taskSummary}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
        <DialogBox
          onClose={() => {
            setInputComments("");
          }}
          ref={modalRef}
        >
          <Spin spinning={isLoading}>
            <div className="flex">
              <span className={styles.alert_icon}>
                <AlertTriangle />
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className={styles.modal_heading}>
                {t("timesheet.requestRevision")}
              </div>
              <div className={styles.modal_desc}>
                {t("timesheet.requestRevisionDesc")}
              </div>
            </div>
            <div className="mt-2">
              <Input
                name="details"
                value={inputComments}
                onChange={(e) => {
                  setInputComments(e.target?.value);
                }}
                inputType="textArea"
                size="small"
              />
            </div>
            <div className="flex gap-4 w-full mt-12">
              <Button
                onClick={() => modalRef?.current?.closeModal()}
                btn_class="white_full_btn"
                label={t("button.cancel")}
              />
              <Button
                btn_class="full_width_btn"
                onClick={onRequestRevision}
                label={t("button.submit")}
              />
            </div>
          </Spin>
        </DialogBox>
        <DialogBox width={390} ref={modalRefSuccess}>
          <Spin spinning={isLoading}>
            <div className="flex">
              <span className={styles.alert_icon}>
                <TickGreen />
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className={styles.modal_heading}>
                {t("timesheet.timesheetApproved")}
              </div>
              <div className={`${styles.modal_desc}`}>
                {t("timesheet.timesheetApprovedDesc")}
              </div>
            </div>

            <div className="flex w-full mt-8">
              <Button
                btn_class="full_btn"
                onClick={() => {
                  modalRefSuccess.current?.closeModal();
                  if (resourceId && engagementsId) {
                    const path = ROUTES.VIEW_TIMESHEET.replace(
                      ":id",
                      resourceId
                    ).replace(":engId", engagementsId);
                    navigate(path);
                  }
                }}
                label={t("button.continue")}
              />
            </div>
          </Spin>
        </DialogBox>
      </PrivatePageTemplate>
    </Spin>
  );
};
