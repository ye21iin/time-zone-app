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
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start gap-6 transition-all hover:shadow-md"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {plan.title}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-500">
                    {USER_CITY}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {vancouverTime}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    {plan.city || "Event local time"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
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
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
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
