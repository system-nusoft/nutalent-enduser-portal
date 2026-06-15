import { Avatar, Divider, Empty, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  DollarCircle,
  Lightning,
  StarSimple,
  StarSimpleGolden,
} from "src/assets";
import {
  getElasticSearchList,
} from "src/store/selectors/features/elastic-search-selector";
import { colors, getRandomColor } from "src/utils/colors";
import { formatDisplayName } from "src/utils/formatName";
import Button from "../button/Button";
import { RoundTag } from "../round-tag/RoundTag";
import styles from "./styles.module.scss";

interface props {
  firstName?: string;
  lastName?: string;
  onClickRow?: (data: any) => void;
  limit?: { id: string };
  resourceList?: any[];
  loadingId?: string | null;
  onUpdateStatus?: (id: string) => void;
}

interface SkillsDisplayProps {
  skills: string | string[] | null | undefined;
}

export const ProfileSuggestions = ({
  firstName,
  onClickRow,
  limit,
  lastName,
  resourceList,
  loadingId,
  onUpdateStatus,
}: props) => {
  const { t } = useTranslation();
  const list: any = useSelector(getElasticSearchList);

  const profileList =
    limit && Array.isArray(list)
      ? list?.slice(0, 4).filter((i) => i.id !== limit?.id)
      : Array.isArray(resourceList)
      ? resourceList
      : [];

  const SkillsDisplay = ({ skills }: SkillsDisplayProps) => {
    const skillArray = Array.isArray(skills)
      ? skills.map((item) => String(item).trim()).filter(Boolean)
      : typeof skills === "string"
      ? skills.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    if (skillArray.length === 0) return null;

    const maxVisibleTags = window.innerWidth < 640 ? 3 : 3;
    const visibleTags = skillArray.slice(0, maxVisibleTags);
    const hiddenSkills = skillArray.slice(maxVisibleTags);
    const hiddenCount = hiddenSkills.length;

    return (
      <div className="flex justify-start items-center gap-2">
        <div className={`${styles.skills} flex flex-wrap items-center gap-0`}>
          {visibleTags.map((item: any, index: any) => (
            <Tag className={`${styles.tag} mt-2`} key={index}>
              {item}
            </Tag>
          ))}

          {hiddenCount > 0 && (
            <div
              className={styles.tooltipContainer}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => {
                e.stopPropagation();
                // Find the tooltip and trigger elements
                const tooltipElement: any = e.currentTarget.querySelector(
                  `.${styles.tooltip}`
                );
                const triggerElement = e.currentTarget.querySelector(
                  `.${styles.tooltipTrigger}`
                );

                if (tooltipElement && triggerElement) {
                  // First make the tooltip visible but off-screen to get its dimensions
                  tooltipElement.style.display = "flex";
                  tooltipElement.style.position = "fixed";
                  tooltipElement.style.left = "-9999px";
                  tooltipElement.style.top = "-9999px";

                  // Force a reflow to ensure dimensions are calculated
                  void tooltipElement.offsetWidth;

                  // Now position the tooltip correctly
                  const triggerRect = triggerElement.getBoundingClientRect();
                  tooltipElement.style.left = `${
                    triggerRect.left +
                    triggerRect.width / 2 -
                    tooltipElement.offsetWidth / 2
                  }px`;
                  tooltipElement.style.top = `${
                    triggerRect.top - tooltipElement.offsetHeight - 10
                  }px`;
                }
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                // Hide the tooltip on mouse leave
                const tooltipElement: any = e.currentTarget.querySelector(
                  `.${styles.tooltip}`
                );
                if (tooltipElement) {
                  tooltipElement.style.display = "none";
                }
              }}
            >
              <Tag className={`${styles.tag} ${styles.tooltipTrigger} mt-2`}>
                +{hiddenCount} more
              </Tag>
              <div className={styles.tooltip}>
                {hiddenSkills.map((skill: any, index: any) => (
                  <div className={styles.tooltipTag} key={index}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex  flex-col gap-6 items-start pt-8">
      {firstName && profileList?.length > 0 && (
        <div className={styles.heading}>
          {t("heading.profileSimilarTo", {
            name: formatDisplayName(firstName, lastName),
          })}
        </div>
      )}

      {limit ? (
        <div className="grid grid-cols-4 gap-4">
          {profileList?.map(
            (
              {
                firstName,
                lastName,
                profilePicture,
                title,
                skills,
                hourlyRate,
                isCurrentlyHired,
                id,
              },
              index
            ) => (
              <div
                key={index}
                onClick={() => {
                  if (onClickRow) {
                    onClickRow({ firstName, title, id, lastName });
                  }
                }}
                className={` col-span-1 flex flex-col justify-between gap-2 p-6 bg-white rounded-2xl ${
                  onClickRow ? "cursor-pointer" : ""
                }`}
              >
                <div className="rounded-xl flex flex-col items-center gap-4">
                  <Avatar
                    style={{
                      background: getRandomColor(firstName),
                      fontSize: "2.5rem",
                    }}
                    shape="square"
                    size={70}
                    src={profilePicture}
                  >
                    {firstName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div className="flex flex-col">
                    <div
                      className={styles.title}
                      style={{ textAlign: "center" }}
                    >
                      {formatDisplayName(firstName, lastName)}
                    </div>
                    <div
                      style={{ textAlign: "center" }}
                      className={styles.jobTitle}
                    >
                      {title}
                    </div>
                  </div>
                </div>
                <Divider className="m-0" />
                <div className="flex flex-col">
                  <div className="flex justify-between gap-2 items-center">
                    <div className="flex flex-col justify-end items-start gap-2">
                      {!isCurrentlyHired && (
                        <RoundTag
                          text={t("tag.availableNow")}
                          icon={<Lightning />}
                          color="green"
                        />
                      )}
                    </div>
                    <RoundTag
                      text={t("tag.hourRate", { rate: hourlyRate || 0 })}
                      icon={<DollarCircle />}
                    />
                  </div>
                </div>
                <span className={`${styles.skills} h-28 flex flex-wrap gap-2`}>
                  {skills && skills?.length > 0 && SkillsDisplay({ skills })}
                </span>
                {/* button does not look good if there  are no skills  */}
                <Button
                  btn_class="card_grey_btn"
                  label={t("button.viewProfile")}
                />
              </div>
            )
          )}
        </div>
      ) : (
        <div
          className={`grid w-full gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 justify-start items-start`}
        >
          {profileList?.length > 0 ? (
            profileList?.map(
              (
                {
                  firstName,
                  lastName,
                  profilePicture,
                  title,
                  skills,
                  hourlyRate,
                  isFavorited,
                  isCurrentlyHired,
                  id,
                },
                index
              ) => (
                <div
                  key={index}
                  onClick={() => {
                    if (onClickRow) {
                      onClickRow({ firstName, title, id, lastName });
                    }
                  }}
                  className={`rounded-2xl border-gray-300 z-0 flex w-full flex-col gap-2 bg-white p-4 pe-4  ${
                    onClickRow ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="flex gap-2">
                    <div className="flex gap-4 justify-start items-center">
                      <div className="flex flex-col gap-4">
                        {profilePicture ? (
                          <div className={`${styles.img} overflow-hidden`}>
                            <img
                              className="object-contain"
                              key={index}
                              src={profilePicture}
                              alt="profile"
                            />
                          </div>
                        ) : (
                          <div
                            key={index}
                            className={`${styles.without_img} rounded-full  flex items-center justify-center`}
                            style={{ background: getRandomColor(firstName) }}
                          >
                            {firstName?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <div className="flex items-center justify-center">
                          <Button
                            label={t("button.viewProfile")}
                            onClick={() => {
                              if (onClickRow) {
                                onClickRow({ firstName, title, id, lastName });
                              }
                            }}
                            btn_class="card_grey_btn"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full  relative flex flex-col">
                      <div className="flex flex-col">
                        <div className={styles.title}>
                          {formatDisplayName(firstName, lastName)}
                        </div>
                        <div className={styles.jobTitle}>{title}</div>
                        <div className="flex mt-4 flex-wrap gap-2">
                          <RoundTag
                            text={t("tag.hourRate", { rate: hourlyRate || 0 })}
                            icon={<DollarCircle />}
                          />

                          {!isCurrentlyHired && (
                            <RoundTag
                              text={t("tag.availableNow")}
                              icon={<Lightning />}
                              color="green"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-grow justify-start items-end gap-2">
                        <span
                          className={`${styles.skills} flex flex-wrap gap-2`}
                        >
                          {skills &&
                            skills?.length > 0 &&
                            SkillsDisplay({ skills })}
                        </span>
                      </div>
                      <div className="flex items-start justify-end">
                        <Tooltip
                          title={
                            !isFavorited
                              ? t("labels.addToFavorite")
                              : t("labels.removeFromFavorite")
                          }
                          color={colors.tooltip}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onUpdateStatus) onUpdateStatus(id);
                            }}
                            className={`${styles.star} absolute top-0 right-0  p-2 rounded-full flex justify-center items-center  cursor-pointer`}
                          >
                            <div
                              className={` ${
                                loadingId === id
                                  ? `animate-bounce ease-in-out`
                                  : ""
                              }`}
                            >
                              {isFavorited ? (
                                <StarSimpleGolden />
                              ) : (
                                <StarSimple />
                              )}
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="flex items-center justify-center h-96 col-span-2">
              <Empty />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
