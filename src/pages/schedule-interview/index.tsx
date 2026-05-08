import { Form, Spin, Tooltip, Button as AntButton } from "antd";
import { LoadingOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Clock, Earth, Telephone } from "src/assets";
import { Button, Notification } from "src/components";
import CustomCalendar from "src/components/calender/Calender";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import SimpleDropDown from "src/components/simple-drop-down";
import { ROUTES } from "src/constants/navigation-routes";
import {
  getInterviewDetailsData,
  getInterviewDetailsLoading,
} from "src/store/selectors/features/interview-details-selector";
import { interviewLoading } from "src/store/selectors/features/interview-selector";
import {
  getSmartSchedulerData,
  getSmartSchedulerLoading,
} from "src/store/selectors/features/smart-scheduler-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { clearSmartSchedulerSlots } from "src/store/slices/features/smart-scheduler-reducer";
import styles from "./styles.module.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

const returnTimeByTimezone = (
  dateTime: string,
  targetTimezone: string
): string => {
  return dayjs.utc(dateTime).tz(targetTimezone).format("hh:mm A");
};

// SMART_SCHEDULER: shape of a recommended slot from /smart-scheduler/suggest-slots
type RecommendedSlot = {
  startTimeUtc: string;
  endTimeUtc: string;
  score: number;
  reasoning: string;
};

export const ScheduledInterview = () => {
  const { t } = useTranslation();
  const [selectedDay, setIsExpanded] = useState<any>(null);
  const location = useLocation();
  const { id: urlId } = useParams<{ id: string }>();
  const id = urlId || location?.state?.data?.id; // resource id from URL params or state
  const interviewDetails: any = useSelector(getInterviewDetailsData);
  const params = new URLSearchParams(location.search);
  const timezone = params.get("timezone");
  const isUpdate = timezone ? true : false; // is from update param
  const previousSelectedTimeZone = timezone; // resource id
  const [selectedTimeZone, setSelectedTimeZone] = useState<null | string>(null);
  const [success, setSuccess] = useState(false);
  const isLoading = useSelector(getInterviewDetailsLoading);
  const isScheduleingInterview = useSelector(interviewLoading);
  const [timeZones, setTimeZones] = useState<
    { timezone: string; offset: string }[]
  >([]);

  // SMART_SCHEDULER: pull recommendations
  const smartSchedulerData: any = useSelector(getSmartSchedulerData);
  const isFetchingRecommendations = useSelector(getSmartSchedulerLoading);
  const recommendedSlots: RecommendedSlot[] =
    smartSchedulerData?.data?.suggestedSlots ||
    smartSchedulerData?.suggestedSlots ||
    [];
  const hasFetchedRecommendations = !!(
    smartSchedulerData?.data?.suggestedSlots ||
    smartSchedulerData?.suggestedSlots
  );
  const getTimezonesWithOffsets = () => {
    const arr = moment.tz.names(); // Get all timezone names
    const allTimeZones = arr.map((tz) => {
      const offsetInMinutes = moment.tz(tz).utcOffset(); // Get offset in minutes
      const hours = Math.floor(Math.abs(offsetInMinutes) / 60)
        .toString()
        .padStart(2, "0");
      const minutes = Math.abs(offsetInMinutes % 60)
        .toString()
        .padStart(2, "0");
      const sign = offsetInMinutes >= 0 ? "+" : "-";
      const formattedOffset = `${sign}${hours}:${minutes}`;
      return { timezone: tz, offset: formattedOffset };
    });

    const browserTimezone = moment.tz.guess();
    setTimeZones(allTimeZones);
    setSelectedTimeZone(browserTimezone);
  };
  const [prevSelectedTime, setPrevSelectedTime] = useState<
    [{ startTime: string; endTime: string; day: string }] | null
  >();
  const [selectedTime, setSelectedTime] = useState<
    [{ startTime: string; endTime: string; day: string }] | null
  >(null);
  const dispatch = useDispatch();

  const returnWeekDay = () => {
    if (selectedDay) {
      const date = new Date(selectedDay);
      return `${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        weekday: "long",
      })}`;
    } else {
      return "";
    }
  };

  const onSelectTime = ({
    startTime,
    endTime,
  }: {
    startTime: string;
    endTime: string;
  }) => {
    selectTime([{ startTime, endTime, day: selectedDay }]);
    setPrevSelectedTime(null);
  };

  // SMART_SCHEDULER: check whether a slot (in selectedTimeZone) matches a recommendation
  const isRecommendedSlot = (startTime: string): boolean => {
    if (!recommendedSlots.length || !selectedTimeZone || !selectedDay) {
      return false;
    }
    const slotDateStr = dayjs(selectedDay).format("YYYY-MM-DD");
    return recommendedSlots.some((rec) => {
      const recLocal = dayjs.utc(rec.startTimeUtc).tz(selectedTimeZone);
      return (
        recLocal.format("YYYY-MM-DD") === slotDateStr &&
        recLocal.format("hh:mm A") === startTime
      );
    });
  };

  const returnTimeSlot = ({
    startTime,
    endTime,
  }: {
    startTime: string;
    endTime: string;
  }) => {
    const isRecommended = isRecommendedSlot(startTime);
    // SMART_SCHEDULER: check recommendation for highlight
    return (
      <div
        onClick={() => onSelectTime({ startTime, endTime })}
        className={`border cursor-pointer  p-3 flex items-center justify-center ${
          selectedTime && startTime === selectedTime[0]?.startTime
            ? "text-white border-blue-300 bg-blue-300"
            : "text-blue-600 border-blue-300"
        }  ${
          prevSelectedTime && startTime === prevSelectedTime[0]?.startTime
            ? "text-green-700 border-green-300 bg-green-300"
            : "text-blue-600 border-blue-300"
        } ${isRecommended ? styles.recommended_slot : ""}`}
      >
        {startTime} : {endTime}
      </div>
    );
  };

  const selectTime = (
    date: [{ startTime: string; endTime: string; day: string }]
  ) => {
    setSelectedTime(date);
  };

  const createIsoString = (
    timeString: string // e.g., "10:56 AM"
  ) => {
    // Parse the time and date together in the selected timezone

    if (selectedTimeZone) {
      const isoString = dayjs
        .tz(
          `${dayjs(selectedDay).format("YYYY-MM-DD")} ${timeString}`,
          "YYYY-MM-DD hh:mm A",
          selectedTimeZone
        )
        .toISOString();

      return isoString;
    } else {
      return "";
    }
  };

  const updateScheduledInterview = () => {
    if (!prevSelectedTime && !selectedTime) {
      return Notification({
        type: "error",
        message: t("notification.selectTimeslot"),
      });
    }

    if (selectedTimeZone) {
      const payload = {
        selectedSlotMeet: {
          startTime: "",
          endTime: "",
        },
        selectedSlot: {
          startTime: "",
          endTime: "",
        },
      };

      if (prevSelectedTime) {
        if (dayjs(prevSelectedTime[0]?.startTime).isBefore(dayjs())) {
          return Notification({
            type: "error",
            message: t("notification.interviewInFuture"),
          });
        } else {
          payload.selectedSlotMeet.startTime = createTimeForMeet(
            prevSelectedTime[0]?.startTime
          );
          payload.selectedSlotMeet.endTime = createTimeForMeet(
            prevSelectedTime[0]?.endTime
          );
          payload.selectedSlot.startTime = createTimeForSelectedSlots(
            prevSelectedTime[0]?.startTime
          );
          payload.selectedSlot.endTime = createTimeForSelectedSlots(
            prevSelectedTime[0]?.endTime
          );
        }
      }

      if (selectedTime) {
        if (dayjs(selectedTime[0].startTime).isBefore(dayjs())) {
          return Notification({
            type: "error",
            message: t("notification.interviewInFuture"),
          });
        } else {
          payload.selectedSlotMeet.startTime = createTimeForMeet(
            selectedTime[0]?.startTime
          );
          payload.selectedSlotMeet.endTime = createTimeForMeet(
            selectedTime[0]?.endTime
          );
          payload.selectedSlot.startTime = createTimeForSelectedSlots(
            selectedTime[0]?.startTime
          );
          payload.selectedSlot.endTime = createTimeForSelectedSlots(
            selectedTime[0]?.endTime
          );
        }
      }

      if (
        !payload.selectedSlot.startTime ||
        !payload.selectedSlotMeet.startTime
      ) {
        return Notification({
          type: "error",
          message: t("notification.selectTimeslot"),
        });
      }

      dispatch(
        RequestAppAction.handleUpdateInterview({
          id: id,
          data: payload,
          timeZone: selectedTimeZone,
          cbSuccess() {
            setSuccess(true);
            Notification({
              type: "success",
              message: t("heading.yourInterviewHasBeenRescheduled"),
            });
          },
        })
      );
    }
  };

  const createTimeForSelectedSlots = (time: string) => {
    if (!selectedDay || !selectedTimeZone) return "";

    const combined = `${dayjs(selectedDay).format("YYYY-MM-DD")} ${time}`;

    const zoned = dayjs.tz(combined, "YYYY-MM-DD hh:mm A", selectedTimeZone);

    return zoned.toISOString();
  };

  const createTimeForMeet = (time: string) => {
    if (!selectedDay) return "";

    // Parse time in 12-hour format using Day.js
    const parsedTime = dayjs(time, "h:mm A");

    if (!parsedTime.isValid()) return "";

    // Format time to 24-hour HH:mm:ss
    const time24 = parsedTime.format("HH:mm:ss");

    const selectedDate = dayjs(selectedDay).format("YYYY-MM-DD");
    // Combine date and formatted time into UTC string
    const utcTime = `${selectedDate}T${time24}Z`;

    return utcTime;
  };

  const scheduleInterview = () => {
    if (selectedTime && selectedTimeZone) {
      const payload = {
        selectedSlotMeet: {
          startTime: createTimeForMeet(selectedTime[0]?.startTime),
          endTime: createTimeForMeet(selectedTime[0]?.endTime),
        },
        selectedSlot: {
          startTime: createTimeForSelectedSlots(selectedTime[0]?.startTime),
          endTime: createTimeForSelectedSlots(selectedTime[0]?.endTime),
        },
      };

      dispatch(
        RequestAppAction.handlePostInterview({
          id: id,
          data: payload,
          timeZone: selectedTimeZone,
          cbSuccess() {
            setSuccess(true);
            Notification({
              type: "success",
              message: t("heading.yourInterviewHasBeenScheduled"),
            });
          },
        })
      );
    }
  };

  const navigate = useNavigate();

  const convertToTimezone = (
    currentDay: string,
    startTime: string // e.g., "3:21 PM"
  ) => {
    // Parse the input time as local time

    if (selectedTimeZone) {
      console.log("Selected Time Zone:", selectedTimeZone);

      const timeInLocal = dayjs(
        `${dayjs(currentDay).format("YYYY-MM-DD")} ${startTime}`,
        "YYYY-MM-DD hh:mm A"
      ).subtract(1, "day");

      // Convert to the target timezone
      const timeInTargetTimezone = timeInLocal
        .tz(selectedTimeZone)
        .format("hh:mm A");

      return timeInTargetTimezone;
    } else {
      return "";
    }
  };

  const filterterdTimeSlots = () => {
    if (!selectedDay || isNaN(new Date(selectedDay).getTime())) {
      return null; // Don't render anything if selectedDay is invalid
    }

    const date = new Date(selectedDay);
    const weekday = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (selectedTimeZone && interviewDetails?.timezone) {
      return (
        Array.isArray(interviewDetails?.interviewTimeSlots) &&
        interviewDetails?.interviewTimeSlots.map((item: any) => {
          if (
            interviewDetails &&
            interviewDetails?.interviewDays?.includes(weekday)
          ) {
            // Step 1: Convert slot to UTC using interviewDetails.timezone
            const startUtc = dayjs
              .tz(
                `${dayjs(selectedDay).format("YYYY-MM-DD")} ${item?.startTime}`,
                "YYYY-MM-DD hh:mm A",
                interviewDetails.timezone
              )
              .utc();

            const endUtc = dayjs
              .tz(
                `${dayjs(selectedDay).format("YYYY-MM-DD")} ${item?.endTime}`,
                "YYYY-MM-DD hh:mm A",
                interviewDetails.timezone
              )
              .utc();

            // Step 2: Convert UTC slot to selectedTimeZone
            const startTime = startUtc.tz(selectedTimeZone).format("hh:mm A");
            const endTime = endUtc.tz(selectedTimeZone).format("hh:mm A");

            return returnTimeSlot({
              startTime,
              endTime,
            });
          }
        })
      );
    }
  };

  // SMART_SCHEDULER: dispatch the smart-scheduler request
  const fetchSmartSchedule = () => {
    if (!id || !selectedTimeZone) return;
    dispatch(
      RequestAppAction.handleGetSmartSchedulerSlots({
        data: {
          resourceId: id,
          userTimeZone: selectedTimeZone,
          maxSuggestions: 5,
          preferMidWeek: true,
        },
        cbSuccess: (res) => {
          const slots = res?.data?.suggestedSlots || [];
          if (slots.length === 0) {
            Notification({
              type: "info",
              message: t("notification.noRecommendedSlots"),
            });
          }
        },
        cbFailure: (msg) => {
          const isOverloaded =
            msg?.includes("high demand") ||
            msg?.includes("temporarily unavailable") ||
            msg?.includes("503");
          Notification({
            type: "error",
            message: isOverloaded
              ? t("notification.smartSchedulerBusy")
              : t("notification.smartSchedulerFailed"),
          });
        },
      })
    );
  };

  useEffect(() => {
    if ((Array.isArray(timeZones) && timeZones?.length > 0) || selectedTimeZone)
      dispatch(
        RequestAppAction.handleGetInterviewDetails({
          id: id,
          data: {
            timeZone:
              previousSelectedTimeZone ??
              selectedTimeZone ??
              timeZones[0]?.timezone,
          },
          cbSuccess: (res) => {
            if (timezone) {
              const interviewBookingResDetails = res?.data;
              // setSelectedTimeZone(previousSelectedTimeZone ?? null);

              const interviewBooking =
                interviewBookingResDetails?.interviewBooking;

              if (Array.isArray(interviewBooking)) {
                if (selectedTimeZone) {
                  setPrevSelectedTime([
                    {
                      startTime: returnTimeByTimezone(
                        interviewBooking[0]?.startTime,
                        selectedTimeZone
                      ),
                      endTime: returnTimeByTimezone(
                        interviewBooking[0]?.endTime,
                        selectedTimeZone
                      ),
                      day: selectedDay,
                    },
                  ]);
                }
                const selectedDate = dayjs(interviewBooking[0]?.startTime);
                setIsExpanded(selectedDate);
              }
            }
          },
          cbFailure: () => {
            navigate(-1);
          },
        })
      );
  }, [timeZones]);

  useEffect(() => {
    if (id) {
      getTimezonesWithOffsets();
    } else {
      navigate(ROUTES.INTERVIEW);
    }

    return () => {
      setTimeZones([]);
      setIsExpanded(null);
      // SMART_SCHEDULER: clear cached recommendations on unmount
      dispatch(clearSmartSchedulerSlots());
    };
  }, []);

  // Watch for resource ID changes and refetch interview details
  useEffect(() => {
    // Reset state when resource ID changes
    setIsExpanded(null);
    setSelectedTime(null);
    setPrevSelectedTime(null);
    setSuccess(false);
    
    if (id && timeZones.length > 0) {
      dispatch(
        RequestAppAction.handleGetInterviewDetails({
          id: id,
          data: {
            timeZone:
              previousSelectedTimeZone ??
              selectedTimeZone ??
              timeZones[0]?.timezone,
          },
          cbSuccess: (res) => {
            if (timezone) {
              const interviewBookingResDetails = res?.data;
              const interviewBooking = interviewBookingResDetails?.interviewBooking;

              if (Array.isArray(interviewBooking)) {
                const booking = interviewBooking.find(
                  (booking: any) => booking.day === selectedDay
                );

                if (booking) {
                  setPrevSelectedTime([booking]);
                  setSelectedTime(null);
                }
              }
            }
          },
          cbFailure: () => {
            navigate(-1);
          },
        })
      );
    }
  }, [id]); // Only depends on ID to refetch when it changes

  const buttons = [];

  if (!success && isUpdate) {
    buttons.push({
      onClick: () => {
        updateScheduledInterview();
      },
      label: t("button.update"),
      disabled: dayjs(selectedDay) < dayjs(),
    });
  }

  if (!success && !isUpdate) {
    buttons.push({
      label: t("button.schedule"),
      disabled: selectedTime && selectedTime?.length > 0 ? false : true,
      onClick: () => {
        // schedule post api
        scheduleInterview();
      },
    });
  }

  const [form] = useForm();
  useEffect(() => {
    form.setFieldValue("timezone", selectedTimeZone);
    if (selectedDay) setIsExpanded(null);
    // SMART_SCHEDULER: clear recommendations when timezone changes
    dispatch(clearSmartSchedulerSlots());
  }, [selectedTimeZone]);

  return (
    <PrivatePageTemplate
      buttons={buttons?.length > 0 ? buttons : false}
      description={interviewDetails?.title}
      avatar={{
        img: interviewDetails?.profilePicture,
        name: interviewDetails?.firstName,
      }}
      title={
        (interviewDetails?.firstName ?? " ") +
        " " +
        (interviewDetails?.lastName ?? "")
      }
    >
      {success ? (
        <div className="flex flex-col gap-4 items-center justify-center h-[70vh] ">
          <img
            className={styles.img_gif}
            src={require("../../assets/image/interview-scheduled.gif")}
          />
          <div className={styles.greeting_text}>
            {t("heading.congratulations")}
          </div>
          <div className={styles.greeting_desc}>
            {isUpdate
              ? t("heading.yourInterviewHasBeenRescheduled")
              : t("heading.yourInterviewHasBeenScheduled")}
          </div>
          <Button
            onClick={() => {
              navigate(ROUTES.INTERVIEW);
            }}
            label={t("button.backToInterview")}
          />
        </div>
      ) : (
        <div className="white-container">
          <Spin
            spinning={isLoading || isScheduleingInterview}
          >
            <div className="grid grid-cols-4">
              <div className="col-span-1">
                <div className="flex flex-col pe-2 gap-6">
                  <div className={styles.Interview_text}>
                    {t("heading.interview")}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div>
                        <Clock />
                      </div>
                      <div className={styles.icon_text}>
                        {t("heading.interviewDuration", {
                          duration: interviewDetails?.interviewDuration,
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <Telephone />
                      </div>
                      <div className={styles.icon_text}>
                        {t("heading.googleMeet")}
                      </div>
                    </div>
                  </div>
                  <div className={styles.desc}>
                    {t("interview.description")}
                  </div>
                  <div className={styles.desc}>
                    {t("interview.description2")}
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-700 ease-in-out border px-12 flex flex-col gap-6 border-l-slate-300 border-r-0 border-t-0 border-b-0 ${
                  selectedDay ? "col-span-2" : "col-span-3"
                }`}
              >
                <CustomCalendar
                  setSelectedDates={setIsExpanded}
                  selectedDay={selectedDay}
                  setPrevSelectedTime={() => setPrevSelectedTime(null)}
                  interviewDays={interviewDetails?.interviewDays}
                  recommendedDates={recommendedSlots?.map((rec) =>
                    dayjs.utc(rec.startTimeUtc).tz(selectedTimeZone || "UTC").format("YYYY-MM-DD")
                  )}
                />

                <div className="w-100 ">
                  <Form form={form}>
                    <SimpleDropDown
                      label={t("labels.timezone")}
                      name="timezone"
                      labelRender={(e) => (
                        <span className="flex gap-2 items-center">
                          <Earth /> {e?.label}
                        </span>
                      )}
                      value={selectedTimeZone}
                      onChange={(e: string) => setSelectedTimeZone(e)}
                      options={timeZones?.map((i) => ({
                        value: i?.timezone,
                        label: `${i?.timezone + " " + i?.offset}`,
                      }))}
                    />
                  </Form>
                </div>
              </div>
              <div className={`${selectedDay ? "col-span-1" : "hidden"}`}>
                <div className="h-full flex flex-col items-center  p-6 pt-14">
                  {/* SMART_SCHEDULER: button + recommended-slots heading */}
                  <div className="w-full flex flex-col items-center gap-2 mb-2">
                    <AntButton
                      ghost
                      type="primary"
                      onClick={fetchSmartSchedule}
                      disabled={isFetchingRecommendations || !selectedTimeZone}
                    >
                      <span className="flex items-center" style={{ gap: "10px" }}>
                        {isFetchingRecommendations ? (
                          <>
                            <LoadingOutlined />
                            {t("button.loading")}
                          </>
                        ) : hasFetchedRecommendations ? (
                          t("button.refresh")
                        ) : (
                          t("button.smartSchedule")
                        )}
                        <Tooltip title={t("tooltip.smartScheduleInfo")} placement="top">
                          <InfoCircleOutlined
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: "help", marginLeft: "8px" }}
                          />
                        </Tooltip>
                      </span>
                    </AntButton>
                    {hasFetchedRecommendations && recommendedSlots.length > 0 && (
                      <div className={styles.recommended_heading}>
                        {t("heading.recommendedSlots")}
                      </div>
                    )}
                  </div>
                  <div className={styles.icon_text}>{returnWeekDay()}</div>
                  <div className="h-96 px-2 mt-2 overflow-auto w-full flex flex-col gap-2">
                    {Array.isArray(interviewDetails?.interviewTimeSlots) &&
                      filterterdTimeSlots()}
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      )}
    </PrivatePageTemplate>
  );
};
