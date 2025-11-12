import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { classNames } from "../../../utils/classNames";
import { getTodayDate, isValidISOFormat } from "../Calendar.utils";
import { CalendarDayPicker } from "../CalendarDayPicker";
import { CalendarMonthPicker } from "../CalendarMonthPicker";
import { CalendarYearPicker } from "../CalendarYearPicker";
import { CalendarType } from "./Calendar.types";
import type { CalendarProps } from "./Calendar.types";

/**
 * Calendar component to select dates in day, month, and year views.
 *
 * @example
 * ```js
 * const [selectedDate, setSelectedDate] = useState();
 *
 * <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
 * ```
 *
 * */
const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selectedDate, activeDate, style, calendarRef, onSelectDate }, ref) => {
    const [view, setView] = useState<CalendarType>(CalendarType.Day);

    const isValidSelectedDate = isValidISOFormat(selectedDate);
    const today = getTodayDate();
    const [year, month] = (isValidSelectedDate ? (selectedDate ?? "") : today)
      .split("-")
      .map(Number);
    const [activeMonth, setActiveMonth] = useState(month - 1);
    const [activeYear, setActiveYear] = useState(year);

    const increaseYear = () => {
      setActiveYear((prev) => prev + 1);
    };
    const decreaseYear = () => {
      setActiveYear((prev) => prev - 1);
    };

    const onSelectMonth = (month: number) => {
      setActiveMonth(month);
      setView(CalendarType.Day);
    };

    const onSelectYear = (year: number) => {
      setActiveYear(year);
      setView(CalendarType.Month);
    };

    useImperativeHandle(calendarRef, () => {
      return {
        moveTo: (month: number, year: number) => {
          setActiveMonth(month - 1);
          setActiveYear(year);
          setView(CalendarType.Day);
        }
      };
    });

    useEffect(() => {
      if (selectedDate && !isValidSelectedDate) {
        console.error(
          `Invalid date format. Please provide date in the format YYYY-MM-DD, \nProvided value: ${selectedDate}`
        );
      }
    }, [selectedDate, isValidSelectedDate]);

    const renderContent = () => {
      const decreaseMonth = () => {
        if (activeMonth - 1 < 0) {
          setActiveMonth(() => 11);
          decreaseYear();
        } else {
          setActiveMonth(() => activeMonth - 1);
        }
      };

      const increaseMonth = () => {
        if (activeMonth + 1 > 11) {
          setActiveMonth(() => 0);
          increaseYear();
        } else {
          setActiveMonth(() => activeMonth + 1);
        }
      };

      if (view === CalendarType.Day) {
        return (
          <CalendarDayPicker
            activeDate={activeDate}
            activeMonth={activeMonth}
            activeYear={activeYear}
            onClickHeader={() => {
              setView(CalendarType.Month);
            }}
            onClickLeftArrow={decreaseMonth}
            onClickRightArrow={increaseMonth}
            onSelectDate={onSelectDate}
            selectedDate={selectedDate}
          />
        );
      }

      if (view === CalendarType.Month) {
        return (
          <CalendarMonthPicker
            activeMonth={activeMonth}
            activeYear={activeYear}
            onClickHeader={() => {
              setView(CalendarType.Year);
            }}
            onClickLeftArrow={decreaseYear}
            onClickRightArrow={increaseYear}
            onSelectMonth={onSelectMonth}
          />
        );
      }

      return <CalendarYearPicker activeYear={activeYear} onSelectYear={onSelectYear} />;
    };

    return (
      <div
        className={classNames(`HPuiCalendar HPuiCalendar--mode-${view}`, className)}
        ref={ref}
        style={style}>
        {renderContent()}
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

export default Calendar;
