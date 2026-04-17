"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  convertToUtc,
  formatDateTimeLocalValueInZone,
  guessTimeZoneFromCity,
  splitDateTimeLocalValue,
} from "@/utils/time";
import FormPage from "./form/FormPage";

interface EditPlanModalProps {
  plan: {
    id: string;
    title: string;
    city: string;
    start_time: string;
  };
  onClose: () => void;
}

export default function EditPlanModal({ plan, onClose }: EditPlanModalProps) {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState(plan.city);
  const router = useRouter();
  const supabase = createClient();
  const guessedTimezone = guessTimeZoneFromCity(city);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const city = formData.get("city") as string;
    const startTime = formData.get("startTime") as string;
    const timezone = guessTimeZoneFromCity(city);

    if (!timezone) {
      alert(
        "도시 기준 시간대를 찾을 수 없어요. 더 구체적인 도시 이름을 입력해 주세요.",
      );
      setLoading(false);
      return;
    }

    const { date, time } = splitDateTimeLocalValue(startTime);

    const { error } = await supabase
      .from("plans")
      .update({
        title,
        city,
        start_time: convertToUtc(date, time, timezone).toISOString(),
      })
      .eq("id", plan.id);

    if (error) {
      alert("수정 실패: " + error.message);
    } else {
      onClose(); // 성공 시 모달 닫기
      router.refresh(); // 서버 컴포넌트 데이터 갱신
    }
    setLoading(false);
  };

  return (
    // 1. 모달 오버레이 (배경 클릭 시 닫기)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 2. 모달 컨텐츠 박스 (내부 클릭 시 이벤트 전파 차단) */}
      <div
        className="w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5 animate-in zoom-in duration-200 dark:bg-slate-900 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <FormPage
          title="Edit Your Plan"
          submitLabel="Update Plan"
          submitLoadingLabel="Updating..."
          onSubmit={handleUpdate}
          loading={loading}
          isModal={true} // 👈 아까 추가한 프로퍼티
        >
          {/* 3. FormPage의 children으로 입력 필드들 구성 */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">
                Plan Title
              </label>
              <input
                name="title"
                defaultValue={plan.title}
                placeholder="e.g. Lunch with Erine"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-base font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:ring-blue-950"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">
                City
              </label>
              <input
                name="city"
                value={city}
                placeholder="e.g. Vancouver"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-base font-medium text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:ring-blue-950"
                required
                onChange={(e) => setCity(e.target.value)}
              />
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {guessedTimezone
                  ? `Saved as ${guessedTimezone} local time`
                  : "Enter a city name that maps clearly to a timezone"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                defaultValue={
                  guessedTimezone
                    ? formatDateTimeLocalValueInZone(
                        plan.start_time,
                        guessedTimezone,
                      )
                    : ""
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-base font-medium text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900 dark:focus:ring-blue-950"
                required
              />
            </div>
          </div>
        </FormPage>

        {/* 4. 하단 취소 버튼 (선택 사항) */}
        <button
          onClick={onClose}
          className="w-full border-t border-gray-100 px-6 py-4 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          Cancel and Close
        </button>
      </div>
    </div>
  );
}
