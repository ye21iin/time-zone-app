"use client";

import { useState } from "react";
import { USER_CITY, USER_TIMEZONE } from "@/lib/constant";
import { formatTimeInZone, guessTimeZoneFromCity } from "@/utils/time";
import DeletePlanButton from "./DeletePlanButton";
import EditPlanModal from "./EditPlanModal";

interface Plan {
  id: string;
  title: string;
  city: string;
  start_time: string;
  user_id: string;
}

export default function PlansList({ initialPlans }: { initialPlans: Plan[] }) {
  // 현재 수정 중인 일정을 담는 상태 (null이면 모달이 닫힘)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  return (
    <div className="space-y-4">
      {initialPlans.map((plan) => {
        const vancouverTime = formatTimeInZone(plan.start_time, USER_TIMEZONE);
        const planTimezone = plan.city ? guessTimeZoneFromCity(plan.city) : null;
        const localPlanTime = planTimezone
          ? formatTimeInZone(plan.start_time, planTimezone)
          : null;

        return (
          <div
            key={plan.id}
            className="group flex items-start justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                {plan.title}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/60 dark:bg-blue-950/40">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-500 dark:text-blue-300">
                    {USER_CITY}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {vancouverTime}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">
                    {plan.city || "Event local time"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {localPlanTime || "Local timezone not set yet"}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col justify-between h-full min-h-[100px]">
              {/* 액션 버튼 그룹 */}
              <div className="mt-4 flex justify-end items-center gap-2">
                {/* 📝 수정 버튼 */}
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="rounded-xl p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-500 dark:text-slate-500 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                  title="Edit plan"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>

                {/* 🗑️ 삭제 버튼 (기존 컴포넌트) */}
                <DeletePlanButton planId={plan.id} />
              </div>
            </div>
          </div>
        );
      })}

      {/* 팝업 모달: editingPlan에 값이 있을 때만 렌더링 */}
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
        />
      )}
    </div>
  );
}
