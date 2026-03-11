"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AddFriendPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // 브라우저 내장 기능을 활용해 지원되는 모든 타임존 가져오기 (알파벳순 정렬)
  const timeZones = Intl.supportedValuesOf("timeZone").sort();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timezone) return alert("타임존을 선택해주세요!");

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase.from("friends").insert([
      {
        name,
        city,
        city_timezone: timezone,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert("에러 발생: " + error.message);
    } else {
      router.push("/friends");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        새 친구 추가
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            친구 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="예: 나나"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            거주 도시
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="예: Tokyo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            타임존 선택
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
            required
          >
            <option value="" disabled>
              타임존을 검색하거나 선택하세요
            </option>
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400 font-light">
            * 리스트에서 도시가 속한 타임존을 선택하세요.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-sm"
        >
          {loading ? "저장 중..." : "친구 등록하기"}
        </button>
      </form>
    </main>
  );
}
