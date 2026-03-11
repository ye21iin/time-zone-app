"use client";

import { useState, useEffect } from "react";

export default function TimeCard({
  timezone,
  name,
  city,
  isMe = false, // 기본값 false
}: {
  timezone: string;
  name: string;
  city: string;
  isMe?: boolean; // prop 추가
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("ko-KR", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    // isMe가 true면 테두리를 파란색으로 강조
    <div
      className={`bg-white p-6 rounded-3xl shadow-sm border transition-all duration-300 transform hover:-translate-y-1 
      ${
        isMe
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-gray-100 hover:shadow-xl"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {name}{" "}
            {isMe && (
              <span className="text-sm font-normal text-blue-600">(나)</span>
            )}
          </h2>
          <p className="text-blue-600 font-medium mt-1">{city}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-full">
          <span className="text-2xl">{isMe ? "🏠" : "🕒"}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-4xl font-bold text-gray-800 tracking-tight">
          {time || "Loading..."}
        </p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">
          Timezone
        </p>
        <p className="text-sm font-mono text-gray-600 mt-1">{timezone}</p>
      </div>
    </div>
  );
}
