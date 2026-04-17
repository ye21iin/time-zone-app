import { parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const normalizeTimeToken = (value: string) =>
  value.toLowerCase().replace(/[_/]+/g, " ").replace(/\s+/g, " ").trim();

export const convertToUtc = (date: string, time: string, timezone: string) => {
  const localDateTime = `${date} ${time}`;
  const parsedDate = parse(localDateTime, "yyyy-MM-dd HH:mm", new Date());

  return fromZonedTime(parsedDate, timezone);
};

export const formatDateTimeLocalValue = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDateTimeLocalValueInZone = (
  value: string | Date,
  timezone: string
) => {
  const date = value instanceof Date ? value : new Date(value);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
};

export const splitDateTimeLocalValue = (value: string) => {
  const [date = "", time = ""] = value.split("T");
  return { date, time };
};

export const deriveCityFromTimeZone = (timezone: string) => {
  const last = timezone.split("/").filter(Boolean).pop();

  return last ? last.replace(/_/g, " ") : timezone;
};

export const guessTimeZoneFromCity = (city: string) => {
  const normalizedCity = normalizeTimeToken(city);
  const timeZones = Intl.supportedValuesOf("timeZone");

  const exactMatch = timeZones.find((timezone) => {
    const parts = timezone.split("/");
    const candidate = normalizeTimeToken(parts[parts.length - 1] ?? timezone);

    return candidate === normalizedCity;
  });

  if (exactMatch) return exactMatch;

  const partialMatch = timeZones.find((timezone) => {
    const normalizedZone = normalizeTimeToken(timezone);
    return normalizedZone.includes(normalizedCity);
  });

  return partialMatch ?? null;
};

export const formatTimeInZone = (value: string, timezone: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));

export const formatDateInputValue = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatTimeInputValue = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const getSuggestedPlanDateTime = (now = new Date()) => {
  const next = new Date(now);
  next.setSeconds(0, 0);

  const minutes = next.getMinutes();
  const roundedMinutes = minutes === 0 ? 0 : Math.ceil(minutes / 30) * 30;
  if (roundedMinutes === 60) {
    next.setHours(next.getHours() + 1, 0, 0, 0);
  } else {
    next.setMinutes(roundedMinutes, 0, 0);
  }

  return {
    date: formatDateInputValue(next),
    time: formatTimeInputValue(next),
  };
};
