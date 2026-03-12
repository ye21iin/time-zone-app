import { parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export const convertToUtc = (date: string, time: string, timezone: string) => {
  // 1. 문자열을 Date 객체로 파싱
  // 2. 타임존을 적용하여 UTC로 변환
  const localDateTime = `${date} ${time}`; // 사용자가 입력한 "2026-03-14"와 "14:00"을 합칩니다.
  const parsedDate = parse(localDateTime, "yyyy-MM-dd HH:mm", new Date());

  // 3.x 버전에서는 fromZonedTime이 이전의 zonedTimeToUtc와 같은 역할을 합니다.
  return fromZonedTime(parsedDate, timezone); // 현지 타임존 기준의 시간을 UTC 기준 시간으로
};
