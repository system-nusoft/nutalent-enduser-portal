import React, { useState } from "react";
import {
  ArrowLineLeft,
  ArrowLineLeftFocus,
  ArrowLineRight,
  ArrowLineRightFocus,
} from "src/assets";
import styles from "./styles.module.scss";

interface CalendarDaysProps {
  currentDate: Date;
  setSelectedDates?: (dates: Date) => void;
  interviewDays: string;
}

interface props {
  setSelectedDates: any;
  selectedDay?: null | string | Date;
  interviewDays: string;
  setPrevSelectedTime: () => void;
  recommendedDates?: string[];
}

const CustomCalendar = ({
  setSelectedDates,
  interviewDays,
  selectedDay,
  setPrevSelectedTime,
  recommendedDates = [],
}: props) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Define highlight start and end dates
  const highlightStart = new Date();
  const highlightEnd = new Date();
  highlightEnd.setDate(highlightStart.getDate() + 16);

  // Check if a date is within the highlighted range
  const isWithinHighlightRange = (date: Date) => {
    return date >= highlightStart && date <= highlightEnd;
  };

  const goToPreviousMonth = () => {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      -1
    );

    // Only navigate if the previous month is within the highlight range
    if (isWithinHighlightRange(previousMonth)) {
      setCurrentDate(previousMonth);
    }
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    // Only navigate if the next month is within the highlight range
    if (isWithinHighlightRange(nextMonth)) {
      setCurrentDate(nextMonth);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = currentDate.getFullYear();
  const month = monthNames[currentDate.getMonth()];
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <button
          className={styles.navButton}
          onClick={goToPreviousMonth}
          onMouseEnter={() => setIsLeftHovered(true)}
          onMouseLeave={() => setIsLeftHovered(false)}
          disabled={
            !isWithinHighlightRange(new Date(year, currentDate.getMonth()))
          }
        >
          {isLeftHovered ? <ArrowLineLeftFocus /> : <ArrowLineLeft />}
        </button>
        <span className={styles.heading}>
          {month} {year}
        </span>
        <button
          className={styles.navButton}
          onClick={goToNextMonth}
          onMouseEnter={() => setIsRightHovered(true)}
          onMouseLeave={() => setIsRightHovered(false)}
          disabled={
            !isWithinHighlightRange(new Date(year, currentDate.getMonth() + 1))
          }
        >
          {isRightHovered ? <ArrowLineRightFocus /> : <ArrowLineRight />}
        </button>
      </header>
      <CalendarDays
        interviewDays={interviewDays}
        setSelectedDates={setSelectedDates}
        setPrevSelectedTime={setPrevSelectedTime}
        currentDate={currentDate}
        selectedDay={selectedDay}
        highlightStart={highlightStart}
        highlightEnd={highlightEnd}
        recommendedDates={recommendedDates}
      />
    </div>
  );
};

interface CalendarDaysProps {
  currentDate: Date;
  setSelectedDates?: (dates: Date) => void;
  highlightStart: Date;
  highlightEnd: Date;
  selectedDay?: any;
  setPrevSelectedTime: () => void;
  recommendedDates?: string[];
}

const CalendarDays: React.FC<CalendarDaysProps> = ({
  currentDate,
  setSelectedDates,
  highlightStart,
  selectedDay,
  highlightEnd,
  setPrevSelectedTime,
  interviewDays,
  recommendedDates = [],
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Days of the week to check against, e.g., "Monday, Tuesday, ..."
  const stringDaysArray = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const isRecommendedDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return recommendedDates.includes(dateStr);
  };

  const isHighlighted = (day: number) => {
    const dayDate = new Date(year, month, day);

    // Check if the day is within the highlighted range and matches a day in `stringDaysArray`
    return (
      dayDate >= highlightStart &&
      dayDate <= highlightEnd &&
      stringDaysArray.includes(
        dayDate.toLocaleDateString("en-US", { weekday: "long" })
      )
    );
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isSameDate = (date1: Date, date2: Date) => {
    const normalizeDate = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth(); // Note: Month is 0-based
      const day = date.getDate();
      return new Date(year, month, day); // Time will default to 00:00:00
    };

    const normalizedDate1 = normalizeDate(date1);
    const normalizedDate2 = normalizeDate(date2);

    // Compare dates as ISO strings or timestamps
    return normalizedDate1.getTime() === normalizedDate2.getTime();
  };

  const filterterdTimeSlots = (day: number) => {
    const date = new Date(year, month, day);
    const weekday = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    return interviewDays?.includes(weekday) ? true : false;
  };

  return (
    <div className="grid grid-cols-7 gap-6">
      {daysOfWeek.map((day) => (
        <div key={day} className={styles.day_label}>
          {day}
        </div>
      ))}
      {daysArray.map((day, index) => (
        <div key={index} className="flex items-center justify-center">
          <div
            onClick={() => {
              if (day && isHighlighted(day) && filterterdTimeSlots(day)) {
                const selectedDate = new Date(year, month, day);
                setSelectedDates && setSelectedDates(selectedDate);
                setPrevSelectedTime();
              }
            }}
            className={`relative ${day ? styles.day_text : undefined} ${
              day && isHighlighted(day) && filterterdTimeSlots(day)
                ? `cursor-pointer bg-blue-300 rounded-full ${styles.day_text_selected}`
                : day
                ? `cursor-default ${styles.day_text}`
                : undefined
            } ${day && isRecommendedDate(day) ? styles.recommended_date : ""}`}
          >
            {day}
            {day &&
            isSameDate(new Date(year, month, day), new Date(selectedDay)) ? (
              <div className="absolute bottom-1 right-0  justify-center items-center flex w-full ">
                <div className="rounded-full bg-slate-700 h-2 w-2" />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomCalendar;
