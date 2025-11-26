import type { DateFormat } from "./BaseDateInput.types";

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

export const sanitizeNumericInput = (value: string, maxLength: number): string => {
  let sanitized = value.replace(/\D/g, "").replace(/^0+/, "");
  if (sanitized.length > maxLength) sanitized = sanitized.slice(0, maxLength);
  return sanitized;
};

export const isValidDate = (year: number, month: number, day: number): boolean => {
  if (year < 1000 || year > 9999) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

// Utility function to format date parts to ISO string
export const formatToISO = (year: number, month: number, day: number): string => {
  if (!isValidDate(year, month, day)) return "";

  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

// Utility function to parse ISO date to display parts
export const parseISOToDisplay = (
  isoDate: string | null | undefined
): { month: string; day: string; year: string } => {
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDate || !isoPattern.test(isoDate)) {
    return { month: "", day: "", year: "" };
  }

  const [year, month, day] = isoDate.split("-");
  return {
    month: month.replace(/^0/, ""), // Remove leading zero for display
    day: day.replace(/^0/, ""), // Remove leading zero for display
    year
  };
};

// Utility function to get segment order based on format
export const getSegmentOrder = (format: DateFormat): Array<"day" | "month" | "year"> => {
  switch (format) {
    case "DD/MM/YYYY":
      return ["day", "month", "year"];
    case "MM/DD/YYYY":
      return ["month", "day", "year"];
    case "YYYY/MM/DD":
      return ["year", "month", "day"];
    default:
      return ["day", "month", "year"];
  }
};

// Utility function to generate placeholder text from format and separator
export const generatePlaceholder = (format: DateFormat, separator: string): string => {
  const formattedPattern = format.replace(/\//g, separator);
  return `Enter date (${formattedPattern})`;
};
