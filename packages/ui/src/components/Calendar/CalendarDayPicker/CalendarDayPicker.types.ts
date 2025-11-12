import type { CalendarActiveProps } from "../Calendar";
import type { CalendarHeaderProps } from "../CalendarHeader";

export interface CalendarDayPickerProps extends CalendarHeaderProps, CalendarActiveProps {
  /**
   * Date string in the format 'YYYY-MM-DD'
   * */
  selectedDate?: string | null;

  /**
   * Callback function that is called when a date is clicked
   * */
  onSelectDate?: (date: string) => void;
}
