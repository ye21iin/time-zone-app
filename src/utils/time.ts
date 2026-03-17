import { parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export const convertToUtc = (date: string, time: string, timezone: string) => {
  const localDateTime = `${date} ${time}`;
  const parsedDate = parse(localDateTime, "yyyy-MM-dd HH:mm", new Date());

  return fromZonedTime(parsedDate, timezone);
};
