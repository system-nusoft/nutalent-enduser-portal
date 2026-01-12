import { Avatar, Form, Skeleton } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { ceil } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DollarCircle, Lightning, UserPlus } from "src/assets";
import { Input, Notification } from "src/components";
import { DatePicker } from "src/components/date-picker";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { RoundTag } from "src/components/round-tag/RoundTag";
import { ROUTES } from "src/constants/navigation-routes";
import { getEngagementLoading } from "src/store/selectors/features/engagements-saga";
import { getResourcesByIdData } from "src/store/selectors/features/resource-by-id";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/utils/colors";
import styles from "./styles.module.scss";
export const HireResource: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  const data: any = useSelector(getResourcesByIdData);
  const isLoading = useSelector(getEngagementLoading);
  const match = pathname.match(/resources\/([^/]+)/);
  const id = match ? match[1] : null;
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const [estimatedHrs, setEstimatedHrs] = useState(0);
  const [form] = useForm();

  const fetchRerource = () => {
    if (id)
      dispatch(
        RequestAppAction.handleGetResourceById({
          id: id,
          cbSuccess: () => {
            setInitialLoading(false);
          },
          cbFailure: () => {
            setInitialLoading(false);
          },
        })
      );
  };

  useEffect(() => {
    fetchRerource();
  }, [id]);

  const onFinish = (val: {
    endDate: string;
    weeklyHours: number;
    startDate: string;
  }) => {
    const { startDate, endDate, weeklyHours } = val;
    if (id)
      dispatch(
        RequestAppAction.handlePostEngagements({
          id: id,
          data: {
            endDate: endDate,
            startDate: startDate,
            weeklyHours: weeklyHours,
          },
          cbSuccess: () => {
            // navigate to resource engagements
            navigate(ROUTES.HIRED_RESOURCES);
            Notification({
              message: t("labels.success"),
              type: "success",
            });
          },
        })
      );
  };

  const calculateHours = (val?: string) => {
    const endDate = form.getFieldValue("endDate");
    const weeklyHours = form.getFieldValue("weeklyHours") ?? 0;

    const start = dayjs();
    const end = dayjs(val || endDate);
    const duration = end.diff(start, "day") + 1;
    const total = (duration / 7) * weeklyHours;
    setEstimatedHrs(ceil(total));
  };

  useEffect(() => {
    form.setFieldValue("startDate", dayjs());
  }, []);

  return (
    <PrivatePageTemplate
      title={t("heading.hireResource")}
      buttons={[
        {
          onClick: () => {
            form.submit();
          },
          btn_class: "filled_btn",
          label: t("button.submit"),
          disabled: initialLoading || isLoading,
          icon: <UserPlus fill={colors.white} />,
        },
      ]}
    >
      <Skeleton loading={initialLoading || isLoading}>
        <div className="p-4 bg-white border flex gap-4  rounded-xl">
          <div>
            {data?.profilePicture ? (
              <div className={styles.avatar}>
                <Avatar
                  src={data?.profilePicture}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            ) : (
              <Avatar>{data?.firstName?.charAt(0)?.toUpperCase()}</Avatar>
            )}
          </div>
          <div className="flex items-start flex-col">
            <div className="flex text-start items-start flex-col gap-1">
              <span className={styles.resource_name}>
                {(data?.firstName ?? "") + " " + (data?.lastName ?? "")}
              </span>
              <span className={styles.resource_title}>{data?.title}</span>
            </div>
            <div>
              <div className="flex mt-4 flex-wrap gap-2">
                <RoundTag
                  text={t("tag.hourRate", { rate: data?.hourlyRate || 0 })}
                  icon={<DollarCircle />}
                />

                {!data?.isCurrentlyHired && (
                  <RoundTag
                    text={t("tag.availableNow")}
                    icon={<Lightning />}
                    color="green"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <Form onFinish={onFinish} form={form}>
          <div className="p-4 bg-white flex-col flex  border rounded-xl">
            <div>
              <DatePicker
                name="startDate"
                disabled
                label={t("labels.startDate")}
              />
              <DatePicker
                onChange={(e) => {
                  calculateHours(e);
                }}
                disabledDate={(current) =>
                  !!current && current.isBefore(dayjs().startOf("day"))
                }
                name="endDate"
                rules={[
                  { required: true, message: t("error.endDateRequired") },
                ]}
                label={t("labels.endDate")}
              />
            </div>
            <Input
              name="weeklyHours"
              inputType="number"
              onlyNumbers
              size="small"
              rules={[
                { required: true, message: t("error.weeklyHoursRequired") },
              ]}
              onChange={() => calculateHours()}
              label={t("labels.weeklyHours")}
            />
          </div>
        </Form>
        <div className="p-4 bg-white border flex gap-8  rounded-xl">
          <div className="flex gap-3 flex-col">
            <div className={styles.card_heading}>
              {t("labels.estimatedHrs")}
            </div>
            <div className={styles.card_desc}>{estimatedHrs}</div>
          </div>
          <div className="flex gap-3 flex-col">
            <div className={styles.card_heading}>
              {t("labels.estimatedAmount")}
            </div>
            <div className={styles.card_desc}>
              ${(estimatedHrs ?? 0) * (data?.hourlyRate ?? 0)}
            </div>
          </div>
        </div>
      </Skeleton>
    </PrivatePageTemplate>
  );
};
