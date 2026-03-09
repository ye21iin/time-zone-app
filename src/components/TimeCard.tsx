"use client";

import { useState, useEffect } from "react";

export default function TimeCard({
  timezone,
  name,
  city,
}: {
  timezone: string;
  name: string;
  city: string;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("ko-KR", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", // 초단위 컨트롤
        hour12: true,
      }).format(new Date());
      setTime(formatted);
    };

    updateTime(); // 컴포넌트 마운트 시 즉시 실행
    const interval = setInterval(updateTime, 1000); // 1분(60000) 1초(1000)
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <p className="text-blue-600 font-medium mt-1">{city}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-full">
          <span className="text-2xl">🕒</span>
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
