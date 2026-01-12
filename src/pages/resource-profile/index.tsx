import { Avatar, Divider, Form, Skeleton, Spin, Tag, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import {
  AddUserBlack,
  DollarCircle,
  Lightning,
  MessageTextSqaure,
  StarSimple,
  StarSimpleGolden,
  VideoCamera,
} from "src/assets";
import { Button, Input, ProfileSuggestions } from "src/components";
import { DialogBox } from "src/components/modal/Modal";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { RoundTag } from "src/components/round-tag/RoundTag";
import { ROUTES } from "src/constants/navigation-routes";
import { EducationHistory, WorkExperience } from "src/interfaces";
import { favoriteResourcesLoading } from "src/store/selectors/features/favorite-selector";
import { messagesLoading } from "src/store/selectors/features/messages-selector";
import {
  getResourcesByIdData,
  resourcesByIdLoading,
} from "src/store/selectors/features/resource-by-id";
import { getResourcesData } from "src/store/selectors/features/resources-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { colors, getRandomColor } from "src/utils/colors";
import { formatToMonthYear } from "src/utils/date.util";
import styles from "./styles.module.scss";

export const ResourceProfile: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const data: any = useSelector(getResourcesByIdData);
  const isLoading = useSelector(resourcesByIdLoading);
  const isLoadingSpin = useSelector(favoriteResourcesLoading);
  const isSendingMessage = useSelector(messagesLoading);
  const firstName = location?.state?.data?.firstName;
  const lastName = location?.state?.data?.lastName;
  const profileList: any = useSelector(getResourcesData);
  const [disabled, setDisabled] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const jobTitle = location?.state?.data?.jobTitle;
  const pathname = location.pathname;
  const match = pathname.match(/resources\/([^/]+)/);
  const id = match ? match[1] : null;
  const [mount, setMount] = useState(true);
  const modalRef = useRef<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRerource = () => {
    if (id)
      dispatch(
        RequestAppAction.handleGetResourceById({
          id: id,
          cbSuccess: () => {
            setInitialLoading(false);
          },
        })
      );
  };

  useEffect(() => {
    fetchRerource();
  }, [id]);

  const resrouceList = () => {
    if (data) {
      const skillArray = data?.skills
        .split(",")
        .map((item: string) => item.trim());
      dispatch(
        RequestAppAction.handleSearchResourceRequest({
          query: { search: skillArray[0] ?? "" },
        })
      );
    }
  };

  useEffect(() => {
    resrouceList();
  }, [data]);

  const onClickRow = (data: {
    id: string;
    firstName: string;
    title: string;
    lastName: string;
  }) => {
    setMount(false);
    dispatch(
      RequestAppAction.handleGetResourceById({
        id: data?.id,
        cbSuccess: () => {
          const path = ROUTES.PROFILERESOURCEBYID.replace(":id", data?.id);
          navigate(path, {
            state: {
              data: {
                id: data?.id,
                firstName: data?.firstName,
                jobTitle: data?.title,
                lastName: data?.lastName,
              },
            },
          });
          setMount(true);
        },
      })
    );
  };

  const formmatedSkills = () => {
    const technologiesString = data?.skills ?? "";
    const technologiesArray = technologiesString.split(", ");
    const formattedTechnologies = technologiesArray.map((tech: string) => (
      <>{tech ? <Tag className={`my-1 ${styles.tag}`}>{tech}</Tag> : <></>}</>
    ));

    return formattedTechnologies;
  };

  const onClickSchedule = (record: any) => {
    const path = generatePath(
      ROUTES.SCHEDULE_INTERVIEW.replace(":id", record.id)
    );

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const onUpdateStatus = (id: string) => {
    dispatch(
      RequestAppAction.handlePostFavoriteResourceStatus({
        resourceId: id,
        cbSuccess: () => {
          fetchRerource();
        },
      })
    );
  };

  const transparentCard = ({
    heading,
    children,
  }: {
    heading: string;
    children?: React.ReactNode;
  }) => {
    return (
      <div className="flex flex-col gap-3">
        <div className={styles.card_heading}>{heading}</div>
        <Divider className="m-0" />
        <div>{children}</div>
      </div>
    );
  };

  const updatedProfileList = Array.isArray(profileList)
    ? profileList?.slice(0, 4).filter((i) => i.id !== id)
    : [];

  const onInquire = (val: { message: string }) => {
    const { message } = val;
    if (id)
      dispatch(
        RequestAppAction.handleSendMessage({
          data: {
            resourceId: id,
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

  const buttons: any = [
    {
      onClick: () => {
        if (id) onUpdateStatus(id);
      },
      icon: (
        <Tooltip
          placement="bottom"
          title={
            data?.isFavorited
              ? t("labels.removeFromFavorite")
              : t("labels.addToFavorite")
          }
          color={colors.tooltip}
        >
          <div
            className={`${styles.star}  p-2 rounded-full flex justify-center items-center  cursor-pointer`}
          >
            {data?.isFavorited ? <StarSimpleGolden /> : <StarSimple />}
          </div>
        </Tooltip>
      ),
      disabled: false,
      btn_class: "transparent_btn",
    },
    {
      onClick: () => {
        if (id) navigate(ROUTES.HIRE_RESOURCE.replace(":id", id));
      },
      icon: (
        <AddUserBlack
          fill={data?.isCurrentlyHired ? colors.black : colors.white}
        />
      ),
      label: t("button.hireNow"),
      btn_class: "filled_btn",
      disabled: data?.isCurrentlyHired,
    },
    {
      icon: <VideoCamera />,
      tooltip: {
        text: data?.isInterviewScheduled
          ? t("labels.interviewScheduledAlready")
          : "",
      },
      onClick: () => {
        if (!data?.isInterviewScheduled) onClickSchedule(data);
        else navigate(ROUTES.INTERVIEW);
      },
      label: !data?.isInterviewScheduled
        ? t("button.scheduleInterview")
        : t("button.interviewDetails"),
    },
    {
      onClick: () => {
        modalRef?.current?.openModal();
      },
      label: t("button.inquire"),
      btn_class: "white_btn",
    },
  ];

  const formatText = (text: string): any => {
    const lines = text
      .replace(/(?<!\*)\*(?!\*)/g, "\n") // treat * as newlines
      .split(/\n/); // split on every newline

    const result: any = [];

    lines.forEach((rawLine, index) => {
      const line = rawLine.trim();

      if (line === "") {
        // Preserve blank lines as <br />
        result.push(<br key={`br-${index}`} />);
        return;
      }

      let content: React.ReactNode[] = [];
      let workingLine = line;

      // Bullet conversion
      if (workingLine.startsWith("-") || workingLine.startsWith("•")) {
        content.push(<span key={`bullet-${index}`}>• </span>);
        workingLine = workingLine.slice(1).trim();
      }

      // Parse inline styles (**bold**, _italic_)
      const parts = [];
      const regex = /(\*\*(.*?)\*\*|_(.*?)_)/g;
      let lastIndex = 0;
      let match;
      let partIndex = 0;

      while ((match = regex.exec(workingLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(workingLine.slice(lastIndex, match.index));
        }

        if (match[2]) {
          parts.push(
            <strong key={`bold-${index}-${partIndex++}`}>{match[2]}</strong>
          );
        } else if (match[3]) {
          parts.push(
            <em key={`italic-${index}-${partIndex++}`}>{match[3]}</em>
          );
        }

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < workingLine.length) {
        parts.push(workingLine.slice(lastIndex));
      }

      content = content.concat(
        parts.map((part, i) =>
          typeof part === "string" ? (
            <span key={`text-${index}-${i}`}>{part}</span>
          ) : (
            part
          )
        )
      );

      result.push(<div key={`line-${index}`}>{content}</div>);
    });

    return result;
  };

  return (
    <Spin spinning={isLoading || !mount || isLoadingSpin || isSendingMessage}>
      <PrivatePageTemplate buttons={initialLoading ? [] : buttons} backBtn>
        {mount ? (
          <Skeleton paragraph={true} loading={initialLoading}>
            <div className="px-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                {data?.profilePicture ? (
                  <div>
                    <img
                      src={data?.profilePicture}
                      className={styles.img_profile}
                    />
                  </div>
                ) : (
                  <Avatar
                    style={{
                      background: getRandomColor(firstName),
                    }}
                    className={`${styles.avatar} shrink-0`}
                    size={70}
                  >
                    <span className={styles.text}>{firstName?.charAt(0)}</span>
                  </Avatar>
                )}

                <div className="flex flex-col items-start">
                  <span className={styles.resource_name}>
                    {(data?.firstName ?? "") + " " + (data?.lastName ?? "")}
                  </span>
                  <span className={styles.resource_job_title}>
                    {data?.title}
                  </span>
                </div>
              </div>
              <div className="flex mt-4 flex-wrap gap-2">
                <RoundTag
                  text={t("tag.hourRate", { rate: data?.hourlyRate || 0 })}
                  icon={<DollarCircle />}
                />

                <RoundTag
                  text={t("tag.yearsOfExperience", {
                    years: data?.totalYearsOfExperience || 0,
                  })}
                  // icon={<DollarCircle />}
                />

                {!data?.isCurrentlyHired && (
                  <RoundTag
                    text={t("tag.availableNow")}
                    icon={<Lightning />}
                    color="green"
                  />
                )}
              </div>
              {transparentCard({
                heading: t("labels.bio"),
                children: (
                  <span className={styles.card_desc}>
                    {formatText(data?.profileSummary ?? "-")}
                  </span>
                ),
              })}
              {transparentCard({
                heading: t("labels.skills"),
                children: (
                  <span className="flex flex-wrap">{formmatedSkills()}</span>
                ),
              })}
              {transparentCard({
                heading: t("labels.experience"),
                children: (
                  <>
                    <span className="flex flex-col gap-4">
                      {Array.isArray(data?.workExperiences) &&
                        data?.workExperiences?.map((data: WorkExperience) => {
                          return (
                            <>
                              <div className={styles.card_job_title_heading}>
                                {data?.jobTitle}
                              </div>
                              <div className="flex justify-between">
                                <div
                                  className={`${styles.card_company_heading}`}
                                >
                                  {data?.organization}
                                </div>
                                <div
                                  className={`${styles.card_company_heading} text-right`}
                                >
                                  {formatToMonthYear(data?.startDate)} -{" "}
                                  {formatToMonthYear(data?.endDate) ??
                                    t("heading.current")}
                                </div>
                              </div>

                              <div className={styles.card_desc}>
                                {formatText(data?.summary ?? "-")}
                              </div>
                            </>
                          );
                        })}
                    </span>
                  </>
                ),
              })}
              {transparentCard({
                heading: t("labels.education"),
                children: (
                  <>
                    <span className="flex flex-col gap-4">
                      {Array.isArray(data?.educationHistory) &&
                        data?.educationHistory?.map(
                          (data: EducationHistory) => {
                            return (
                              <>
                                <div className={styles.card_job_title_heading}>
                                  {data?.certification ?? "-"}
                                </div>
                                <div className="flex justify-between">
                                  <div
                                    className={`${styles.card_company_heading}`}
                                  >
                                    {data?.institute ?? "-"}
                                  </div>
                                  <div
                                    className={`${styles.card_company_heading} text-right`}
                                  >
                                    {formatToMonthYear(data?.completionDate)}
                                  </div>
                                </div>
                              </>
                            );
                          }
                        )}
                    </span>
                  </>
                ),
              })}
              {Array.isArray(updatedProfileList) &&
                updatedProfileList?.length > 0 && (
                  <ProfileSuggestions
                    firstName={firstName}
                    lastName={lastName}
                    limit={id ? { id } : undefined}
                    onClickRow={onClickRow}
                  />
                )}
            </div>
          </Skeleton>
        ) : (
          <></>
        )}

        <DialogBox
          onClose={() => (
            setDisabled(true), form.setFieldValue("message", null)
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
                  rules={[
                    { required: true, message: t("error.detailRequired") },
                  ]}
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
    </Spin>
  );
};
