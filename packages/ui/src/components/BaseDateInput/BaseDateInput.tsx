import type { FC, MouseEvent } from "react";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { classNames } from "../../utils/classNames";
import {
  formatToISO,
  generatePlaceholder,
  getSegmentOrder,
  isValidDate,
  parseISOToDisplay
} from "../DateInput/DateInput.utils";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { BaseDateInputProps } from "./BaseDateInput.types";

const BaseDateInput: FC<BaseDateInputProps> = ({
  value = "",
  onChange,
  disabled = false,
  readOnly = false,
  prefix,
  suffix,
  hasError = false,
  className,
  format = "DD/MM/YYYY",
  separator = "/",
  placeholder,
  placeholderClassName,
  hideClearIcon = false,
  hideCalendarIcon = false,
  renderCalendarIcon,
  onStateUpdate,
  onSubmit,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [lastUpdatedTime, setLastUpdatedTime] = useState(0);

  const focusMonth = useCallback(() => {
    monthRef.current?.focus();
    monthRef.current?.select();
  }, []);

  const focusDay = useCallback(() => {
    dayRef.current?.focus();
    dayRef.current?.select();
  }, []);

  const focusYear = useCallback(() => {
    yearRef.current?.focus();
    yearRef.current?.select();
  }, []);

  const clearFocus = useCallback(() => {
    monthRef.current?.blur();
    dayRef.current?.blur();
    yearRef.current?.blur();
  }, []);

  const updateValue = useCallback(
    (m: string, d: string, y: string) => {
      const monthNum = parseInt(m, 10);
      const dayNum = parseInt(d, 10);
      const yearNum = parseInt(y, 10);

      if (m && d && y && isValidDate(yearNum, monthNum, dayNum)) {
        const isoDate = formatToISO(yearNum, monthNum, dayNum);
        onChange?.(isoDate);
      } else {
        onChange?.(null);
      }

      onStateUpdate?.({ day: d || "", month: m || "", year: y || "" });
    },
    [onChange, onStateUpdate]
  );

  const getDisplayMonth = useCallback(() => {
    if (!month) return "MM";
    return month.length === 1 ? `0${month}` : month;
  }, [month]);

  const getDisplayDay = useCallback(() => {
    if (!day) return "DD";
    return day.length === 1 ? `0${day}` : day;
  }, [day]);

  const getDisplayYear = useCallback(() => {
    if (!year) return "YYYY";
    return year.padStart(4, "0");
  }, [year]);

  const isEmpty = !month && !day && !year;

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/^0+/, "");

      if (value.length > 2) value = value.slice(0, 2);

      const num = parseInt(value, 10);
      if (num > 12) value = "12";

      if (value.length === 1) {
        const digit = parseInt(value, 10);
        if (digit >= 2 && digit <= 9) {
          value = `0${digit}`;
        }
      }

      let newDay = day;
      if (value && day) {
        const monthNum = parseInt(value, 10);
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(year, 10) || new Date().getFullYear();

        const getDaysInMonth = (month: number, year: number): number => {
          return new Date(year, month, 0).getDate();
        };

        const maxDaysInNewMonth = getDaysInMonth(monthNum, yearNum);

        if (dayNum > maxDaysInNewMonth) {
          newDay = "";
          setDay("");
        }
      }

      setMonth(value);
      setLastUpdatedTime(Date.now());
      updateValue(value, newDay, year);

      if (value.length === 2) {
        const segmentOrder = getSegmentOrder(format);
        const currentIndex = segmentOrder.indexOf("month");
        const nextIndex = currentIndex + 1;
        if (nextIndex < segmentOrder.length) {
          const nextSegment = segmentOrder[nextIndex];
          if (nextSegment === "day") focusDay();
          else if (nextSegment === "year") focusYear();
        }
      }
    },
    [day, year, format, updateValue, focusDay, focusYear]
  );

  const handleDayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/^0+/, "");

      if (value.length > 2) value = value.slice(0, 2);

      const dayNum = parseInt(value, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10) || new Date().getFullYear();

      const getDaysInMonth = (month: number, year: number): number => {
        return new Date(year, month, 0).getDate();
      };

      const maxDays = monthNum ? getDaysInMonth(monthNum, yearNum) : 31;

      if (dayNum > maxDays) {
        value = maxDays.toString();
      }

      if (value.length === 1) {
        const digit = parseInt(value, 10);

        if (digit >= 4 && digit <= 9) {
          value = `0${digit}`;
        } else if (digit === 3 && monthNum && maxDays < 31) {
          if (maxDays <= 29) {
            value = `0${digit}`;
          }
        }
      }

      setDay(value);
      setLastUpdatedTime(Date.now());
      updateValue(month, value, year);

      if (value.length === 2) {
        const segmentOrder = getSegmentOrder(format);
        const currentIndex = segmentOrder.indexOf("day");
        const nextIndex = currentIndex + 1;
        if (nextIndex < segmentOrder.length) {
          const nextSegment = segmentOrder[nextIndex];
          if (nextSegment === "month") focusMonth();
          else if (nextSegment === "year") focusYear();
        }
      }
    },
    [month, year, format, updateValue, focusMonth, focusYear]
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/^0+/, "");

      if (value.length > 4) value = value.slice(0, 4);

      let newDay = day;
      if (value.length === 4 && month && day) {
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(value, 10);

        const getDaysInMonth = (month: number, year: number): number => {
          return new Date(year, month, 0).getDate();
        };

        const maxDaysInNewYear = getDaysInMonth(monthNum, yearNum);

        if (dayNum > maxDaysInNewYear) {
          newDay = "";
          setDay("");
        }
      }

      setYear(value);
      setLastUpdatedTime(Date.now());
      updateValue(month, newDay, value);

      if (value.length === 4) {
        const segmentOrder = getSegmentOrder(format);
        const currentIndex = segmentOrder.indexOf("year");
        const nextIndex = currentIndex + 1;
        if (nextIndex < segmentOrder.length) {
          const nextSegment = segmentOrder[nextIndex];
          if (nextSegment === "month") focusMonth();
          else if (nextSegment === "day") focusDay();
        }
      }
    },
    [month, day, format, updateValue, focusMonth, focusDay]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, segment: string) => {
      const segmentOrder = getSegmentOrder(format);
      const currentIndex = segmentOrder.indexOf(segment as "day" | "month" | "year");

      const focusSegment = (index: number) => {
        if (index < 0 || index >= segmentOrder.length) return;
        const targetSegment = segmentOrder[index];
        if (targetSegment === "month") focusMonth();
        else if (targetSegment === "day") focusDay();
        else if (targetSegment === "year") focusYear();
      };

      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          focusSegment(currentIndex - 1);
        } else {
          focusSegment(currentIndex + 1);
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusSegment(currentIndex - 1);
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusSegment(currentIndex + 1);
      }

      if (e.key === "/") {
        e.preventDefault();
        focusSegment(currentIndex + 1);
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clearFocus();
        onSubmit?.();
      }
    },
    [format, focusDay, focusMonth, focusYear, clearFocus, onSubmit]
  );

  const handleDisplayClick = useCallback(
    (segment?: string) => {
      if (disabled || readOnly) return;

      onStateUpdate?.({ day: day || "", month: month || "", year: year || "" });

      if (segment === "month") {
        focusMonth();
      } else if (segment === "day") {
        focusDay();
      } else if (segment === "year") {
        focusYear();
      } else {
        const segmentOrder = getSegmentOrder(format);
        const firstSegment = segmentOrder[0];
        if (firstSegment === "month") focusMonth();
        else if (firstSegment === "day") focusDay();
        else if (firstSegment === "year") focusYear();
      }
    },
    [disabled, readOnly, onStateUpdate, day, month, year, format, focusMonth, focusDay, focusYear]
  );

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setMonth("");
    setDay("");
    setYear("");
    onStateUpdate?.({ day: "", month: "", year: "" });
    onChange?.(null);
    onSubmit?.();
    clearFocus();
  };

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdatedTime;

    if (timeSinceLastUpdate > 500) {
      const { month: m, day: d, year: y } = parseISOToDisplay(value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMonth(m);
      setDay(d);
      setYear(y);
    }
  }, [value, lastUpdatedTime]);

  const allInputs = {
    month: {
      ref: monthRef,
      value: month,
      onChange: handleMonthChange,
      maxLength: 2,
      segment: "month" as const,
      display: getDisplayMonth()
    },
    day: {
      ref: dayRef,
      value: day,
      onChange: handleDayChange,
      maxLength: 2,
      segment: "day" as const,
      display: getDisplayDay()
    },
    year: {
      ref: yearRef,
      value: year,
      onChange: handleYearChange,
      maxLength: 4,
      segment: "year" as const,
      display: getDisplayYear()
    }
  };

  const segmentOrder = getSegmentOrder(format);
  const inputs = segmentOrder.map((segment) => allInputs[segment]);

  const isError =
    (!isEmpty && !isValidDate(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10))) ||
    hasError;

  const containerClasses = classNames(
    "HPuiDateInput",
    disabled && "HPuiDateInput--disabled",
    readOnly && "HPuiDateInput--readOnly",
    !disabled && !readOnly && "HPuiDateInput--enabled",
    isError && "HPuiDateInput--error",
    isEmpty && "HPuiDateInput--empty",
    className
  );

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      {...rest}
      onClick={() => handleDisplayClick()}>
      {Boolean(prefix) && (
        <div className="HPuiDateInput__prefix">
          <DynamicComponentRenderer component={prefix} />
        </div>
      )}

      {!!isEmpty && (
        <span className={classNames("HPuiDateInput__placeholder", placeholderClassName)}>
          {placeholder ?? generatePlaceholder(format, separator)}
        </span>
      )}

      <div className={classNames("HPuiDateInput__display-container")}>
        {inputs.map(({ ref, value, onChange, maxLength, segment, display }, index) => (
          <Fragment key={segment}>
            <label
              className={classNames(
                "HPuiDateInput__segment",
                !value && "HPuiDateInput__segment--empty"
              )}
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                handleDisplayClick(segment);
              }}>
              <input
                ref={ref}
                type="text"
                value={value}
                readOnly={readOnly}
                disabled={disabled}
                className="HPuiDateInput__hidden-input"
                onChange={onChange}
                onKeyDown={(e) => handleKeyDown(e, segment)}
                maxLength={maxLength}
                tabIndex={-1}
              />
              {display}
            </label>

            {index < inputs.length - 1 && (
              <span className="HPuiDateInput__separator">{separator}</span>
            )}
          </Fragment>
        ))}
      </div>

      {Boolean(suffix) && (
        <div className="HPuiDateInput__suffix">
          <DynamicComponentRenderer component={suffix} />
        </div>
      )}

      <div className="HPuiDateInput__icons">
        {!hideClearIcon && !isEmpty && !disabled && !readOnly && (
          <button
            type="button"
            disabled={disabled || readOnly}
            className="HPuiDateInput__clear-button"
            onClick={handleClear}>
            <div className="HPuiDateInput__clear-icon" />
          </button>
        )}

        {renderCalendarIcon}
        {!renderCalendarIcon && !hideCalendarIcon && (
          <div className="HPuiDateInput__calendar-icon" />
        )}
      </div>
    </div>
  );
};

BaseDateInput.displayName = "BaseDateInput";

export default BaseDateInput;
