import type { JSX } from "react";

export type SelectionMode = "single" | "range";

export interface DateRange {
  from: string | null;
  to?: string | null;
}

export interface CalendarActiveProps {
  /**
   * Year value that is selected in the date picker
   * */
  activeYear: number;

  /**
   * Month value index that is selected in the date picker
   * */
  activeMonth: number;

  /**
   * Date string in the format 'YYYY-MM-DD'
   * That is active in the date picker
   * Used for displaying the active date in the date picker
   * This is not used for selecting the date. It is only for displaying the focused date.
   * You can use this to highlight the focused date in the date picker.
   * So that users know if they are navigating the date picker.
   * */
  activeDate?: string;
}

interface BaseCalendarProps extends Pick<CalendarActiveProps, "activeDate"> {
  /**
   * Ref object that is used to call the `moveTo` function
   * */
  calendarRef?: React.Ref<CalendarRef>;
  /**
   * Style object for the calendar container
   * */
  style?: React.CSSProperties;

  /**
   * Style class name for the date picker container
   * */
  className?: string;
}

export interface CalendarSingleModeProps extends BaseCalendarProps {
  /**
   * Selection mode: 'single' for single date selection
   * @default 'single'
   * */
  mode?: "single";

  /**
   * Selected date in the format YYYY-MM-DD
   * */
  selectedDate?: string | null;

  /**
   * Callback function that is called when a date is clicked
   * */
  onSelectDate?: (date: string) => void;
}

export interface CalendarRangeModeProps extends BaseCalendarProps {
  /**
   * Selection mode: 'range' for date range selection
   * */
  mode: "range";

  /**
   * Selected date range with from and to dates
   * */
  selectedRange?: DateRange;

  /**
   * Callback function that is called when a date range is selected
   * */
  onSelectRange?: (range: DateRange | null) => void;

  /**
   * Number of months to display side by side
   * @default 2
   * */
  numberOfMonths?: 1 | 2;
}

export type CalendarProps = CalendarSingleModeProps | CalendarRangeModeProps;

export interface CalendarOverload {
  (props: CalendarSingleModeProps): JSX.Element;
  (props: CalendarRangeModeProps): JSX.Element;
  (props: CalendarProps): JSX.Element;
  displayName: string;
}

export interface CalendarRef {
  /**
   * Moves the date picker to the specified month and year
   * */
  moveTo: (month: number, year: number) => void;

  /**
   * Clears the current selection
   * */
  clearSelection: () => void;
}

export enum CalendarType {
  Day = "day",
  Month = "month",
  Year = "year"
}
