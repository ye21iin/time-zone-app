"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { convertToUtc } from "@/utils/time";

export default function AddPlanForm({ friends }: { friends: any[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState(
    friends[0]?.city_timezone || "America/Vancouver"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 현지 시간(선택한 도시 기준)을 UTC로 변환
    const utcDate = convertToUtc(date, time, timezone);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("plans").insert([
      {
        user_id: user?.id,
        title,
        start_time: utcDate.toISOString(),
        end_time: utcDate.toISOString(),
      },
    ]);

    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      alert("일정이 추가되었습니다!");
      router.push("/plans"); // 저장 후 목록 페이지로 이동
      router.refresh(); // 목록 새로고침
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">일정 이름</label>
        <input
          required
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">날짜</label>
          <input
            type="date"
            required
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">시간</label>
          <input
            type="time"
            required
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          기준 도시 (타임존)
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setTimezone(e.target.value)}
        >
          {friends.map((f) => (
            <option key={f.id} value={f.city_timezone}>
              {f.name} ({f.city})
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
      >
        일정 추가하기
      </button>
    </form>
  );
}
