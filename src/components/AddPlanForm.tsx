"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { convertToUtc } from "@/utils/time";
import FormPage from "@/components/form/FormPage";

interface Friend {
  id: string;
  name: string;
  city: string;
  city_timezone: string;
}

export default function AddPlanForm({ friends }: { friends: Friend[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  // 초기에는 사용자가 직접 선택하도록 빈 값으로 시작 (placeholder 노출)
  const [timezone, setTimezone] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 친구가 없을 때도 일정 추가가 가능하도록 전체 타임존 목록을 fallback으로 제공
  const timeZones = Intl.supportedValuesOf("timeZone").sort();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // 사용자가 타임존을 선택하지 않았다면, 현재 유저(브라우저)의 타임존을 기본값으로 사용
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToUse = timezone || browserTimezone;
    if (!timezone) setTimezone(timezoneToUse);

    // 현지 시간(선택한 도시 기준)을 UTC로 변환
    const utcDate = convertToUtc(date, time, timezoneToUse);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("plans").insert([
      {
        user_id: user.id,
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
    setLoading(false);
  };

  return (
    <FormPage
      title="새 일정 추가"
      onSubmit={handleSubmit}
      submitLabel="일정 추가하기"
      submitLoadingLabel="저장 중..."
      loading={loading}
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          일정 이름
        </label>
        <input
          type="text"
          value={title}
          required
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="예: 팀 미팅"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            날짜
          </label>
          <input
            type="date"
            value={date}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            시간
          </label>
          <input
            type="time"
            value={time}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTime(e.target.value)
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          기준 도시 (타임존)
        </label>
        <select
          value={timezone}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setTimezone(e.target.value)
          }
          className={`w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all ${
            timezone ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <option value="" disabled>
            타임존을 선택하세요
          </option>
          {friends.length > 0 ? (
            <optgroup label="친구 도시">
              {friends.map((f) => (
                <option key={f.id} value={f.city_timezone} className="text-gray-900">
                  {f.name} ({f.city})
                </option>
              ))}
            </optgroup>
          ) : null}
          <optgroup label="전체 타임존">
            {timeZones.map((tz) => (
              <option key={tz} value={tz} className="text-gray-900">
                {tz}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
    </FormPage>
  );
}
