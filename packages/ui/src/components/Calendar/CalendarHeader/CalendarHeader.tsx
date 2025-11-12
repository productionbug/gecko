import type { ReactNode } from "react";

import { classNames } from "../../../utils/classNames";
import type { CalendarHeaderProps } from "./CalendarHeader.types";

function CalendarHeader({
  onClickLeftArrow,
  onClickRightArrow,
  header,
  onClickHeader
}: CalendarHeaderProps): ReactNode {
  return (
    <div className={classNames("HPuiCalendar__header")}>
      <button
        className="HPuiCalendar__header__arrow-button HPuiCalendar__header__arrow-button--left"
        onClick={onClickLeftArrow}
        type="button">
        <div className="HPuiCalendar__header__arrow-left-icon" />
      </button>

      <button
        className={classNames(
          "HPuiCalendar__header__title",
          onClickHeader && "HPuiCalendar__header__title--clickable"
        )}
        onClick={onClickHeader}
        type="button">
        {header}
      </button>

      <button
        className="HPuiCalendar__header__arrow-button HPuiCalendar__header__arrow-button--right"
        onClick={onClickRightArrow}
        type="button">
        <div className="HPuiCalendar__header__arrow-right-icon" />
      </button>
    </div>
  );
}

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;
