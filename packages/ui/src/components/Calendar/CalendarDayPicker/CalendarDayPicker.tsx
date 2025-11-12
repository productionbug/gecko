import { classNames } from "../../../utils/classNames";
import { generateCalendarDates, generateMonthNames, getTodayDate } from "../Calendar.utils";
import { CalendarHeader } from "../CalendarHeader";
import type { CalendarDayPickerProps } from "./CalendarDayPicker.types";

function CalendarDayPicker({
  activeMonth,
  activeYear,
  activeDate,
  selectedDate,
  onSelectDate,
  ...headerProps
}: CalendarDayPickerProps) {
  const today = getTodayDate();
  const { months } = generateMonthNames();
  const dates = generateCalendarDates(activeMonth, activeYear);

  return (
    <>
      <CalendarHeader header={`${months[activeMonth]} ${activeYear}`} {...headerProps} />
      <div className="HPuiCalendar__day-picker-weekdays">
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>

      <div className="HPuiCalendar__day-picker">
        {dates.map((date) => {
          const formattedDate = `${date.year}-${(date.month + 1)
            .toString()
            .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;

          const isSelected = formattedDate === selectedDate;
          const isToday = formattedDate === today;

          return (
            <button
              className={classNames(
                "HPuiCalendar__day-picker__button",
                isToday && "HPuiCalendar__day-picker__button--today",
                isSelected && "HPuiCalendar__day-picker__button--selected",
                `HPuiCalendar__day-picker__button--active-month-${activeMonth === date.month}`,
                activeDate === formattedDate &&
                !isSelected &&
                "HPuiCalendar__day-picker__button--focused"
              )}
              key={`${date.year}-${date.month}-${date.day}`}
              onClick={() => onSelectDate?.(formattedDate)}
              type="button"
            // TODO: add disable
            >
              <span className="HPuiCalendar__day-picker__button__text">{date.day}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default CalendarDayPicker;
