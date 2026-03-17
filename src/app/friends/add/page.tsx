"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import FormPage from "@/components/form/FormPage";

export default function AddFriendPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // 브라우저 내장 기능을 활용해 지원되는 모든 타임존 가져오기 (알파벳순 정렬)
  const timeZones = Intl.supportedValuesOf("timeZone").sort();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <FormPage
      title="새 친구 추가"
      onSubmit={handleSubmit}
      submitLabel="친구 등록하기"
      submitLoadingLabel="저장 중..."
      loading={loading}
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          친구 이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="예: 나나"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          거주 도시
        </label>
        <input
          type="text"
          value={city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCity(e.target.value)
          }
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="예: Tokyo"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          타임존 선택
        </label>
        <select
          value={timezone}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setTimezone(e.target.value)
          }
          className={`w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all ${
            timezone ? "text-gray-900" : "text-gray-400"
          }`}
          required
        >
          <option value="" disabled>
            타임존을 선택하세요
          </option>
          {timeZones.map((tz) => (
            <option key={tz} value={tz} className="text-gray-900">
              {tz}
            </option>
          ))}
        </select>
      </div>
    </FormPage>
  );
}
