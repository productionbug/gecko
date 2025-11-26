/* eslint-disable react-hooks/purity */
import type { FC, MouseEvent, RefObject } from "react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { classNames } from "../../utils/classNames";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { BaseDateInputProps } from "./BaseDateInput.types";
import {
  formatToISO,
  generatePlaceholder,
  getDaysInMonth,
  getSegmentOrder,
  isValidDate,
  parseISOToDisplay,
  sanitizeNumericInput
} from "./BaseDateInput.utils";

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

  const segmentRefs = { month: monthRef, day: dayRef, year: yearRef };

  const focusRef = (ref: RefObject<HTMLInputElement | null>) => {
    ref.current?.focus();
    ref.current?.select();
  };

  const clearFocus = () => {
    monthRef.current?.blur();
    dayRef.current?.blur();
    yearRef.current?.blur();
  };

  const focusNextSegment = (currentSegment: "month" | "day" | "year") => {
    const segmentOrder = getSegmentOrder(format);
    const nextIndex = segmentOrder.indexOf(currentSegment) + 1;
    if (nextIndex < segmentOrder.length) {
      focusRef(segmentRefs[segmentOrder[nextIndex]]);
    }
  };

  const validateAndUpdateDay = (monthNum: number, yearNum: number): string => {
    if (!day) return day;
    const dayNum = parseInt(day, 10);
    const maxDays = getDaysInMonth(monthNum, yearNum);
    if (dayNum > maxDays) {
      setDay(maxDays.toString());
      return "";
    }
    return day;
  };

  const updateValue = (m: string, d: string, y: string) => {
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
  };

  const getDisplayMonth = () => {
    if (!month) return "MM";
    return month.length === 1 ? `0${month}` : month;
  };

  const getDisplayDay = () => {
    if (!day) return "DD";
    return day.length === 1 ? `0${day}` : day;
  };

  const getDisplayYear = () => {
    if (!year) return "YYYY";
    return year.padStart(4, "0");
  };

  const isEmpty = !month && !day && !year;

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = sanitizeNumericInput(e.target.value, 2);

    const num = parseInt(value, 10);
    if (num > 12) value = "12";

    if (value.length === 1) {
      const digit = parseInt(value, 10);
      if (digit >= 2 && digit <= 9) {
        value = `0${digit}`;
      }
    }

    const monthNum = parseInt(value, 10);
    const yearNum = parseInt(year, 10) || new Date().getFullYear();
    const newDay = value ? validateAndUpdateDay(monthNum, yearNum) : day;

    setMonth(value);
    setLastUpdatedTime(Date.now());
    updateValue(value, newDay, year);

    if (value.length === 2) {
      focusNextSegment("month");
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = sanitizeNumericInput(e.target.value, 2);

    const dayNum = parseInt(value, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10) || new Date().getFullYear();
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
      focusNextSegment("day");
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeNumericInput(e.target.value, 4);

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(value, 10);
    const newDay = value.length === 4 && month ? validateAndUpdateDay(monthNum, yearNum) : day;

    setYear(value);
    setLastUpdatedTime(Date.now());
    updateValue(month, newDay, value);

    if (value.length === 4) {
      focusNextSegment("year");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, segment: string) => {
    const segmentOrder = getSegmentOrder(format);
    const currentIndex = segmentOrder.indexOf(segment as "day" | "month" | "year");

    const focusSegmentByIndex = (index: number) => {
      if (index < 0 || index >= segmentOrder.length) return;
      focusRef(segmentRefs[segmentOrder[index]]);
    };

    if (e.key === "Tab") {
      e.preventDefault();
      focusSegmentByIndex(e.shiftKey ? currentIndex - 1 : currentIndex + 1);
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusSegmentByIndex(currentIndex - 1);
    }

    if (e.key === "ArrowRight" || e.key === "/") {
      e.preventDefault();
      focusSegmentByIndex(currentIndex + 1);
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      clearFocus();
      onSubmit?.();
    }
  };

  const handleDisplayClick = (segment?: string) => {
    if (disabled || readOnly) return;

    onStateUpdate?.({ day: day || "", month: month || "", year: year || "" });

    if (segment === "month" || segment === "day" || segment === "year") {
      focusRef(segmentRefs[segment]);
    } else {
      const firstSegment = getSegmentOrder(format)[0];
      focusRef(segmentRefs[firstSegment]);
    }
  };

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
            <div className="HPicon__clear" />
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
