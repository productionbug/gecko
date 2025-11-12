import { classNames } from "../../../utils/classNames";
import { generateMonthNames } from "../Calendar.utils";
import { CalendarHeader } from "../CalendarHeader";
import type { MonthPickerProps } from "./CalendarMonthPicker.types";

function CalendarMonthPicker({
  activeYear,
  activeMonth,
  onSelectMonth,
  ...headerProps
}: MonthPickerProps) {
  const { shortMonths } = generateMonthNames();

  return (
    <>
      <CalendarHeader header={`${activeYear}`} {...headerProps} />

      <div className="HPuiCalendar__month-picker">
        {shortMonths.map((monthName, index) => {
          const selected = index === activeMonth;

          return (
            <button
              className={classNames(
                "HPuiCalendar__month-picker__button",
                selected && "HPuiCalendar__month-picker__button--selected"
              )}
              key={monthName}
              onClick={() => onSelectMonth?.(index)}
              type="button">
              {monthName}
            </button>
          );
        })}
      </div>
    </>
  );
}

CalendarMonthPicker.displayName = "CalendarMonthPicker";

export default CalendarMonthPicker;
