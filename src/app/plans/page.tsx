// src/app/plans/page.tsx
import { createClient } from "@/lib/supabase/server";
import { USER_TIMEZONE } from "@/lib/constant";
import { redirect } from "next/navigation";
import DeletePlanButton from "@/components/DeletePlanButton";
import PrimaryLinkButton from "@/components/PrimaryLinkButton";

export default async function PlansPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 내 일정 가져오기 (시간순 정렬)
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .order("start_time", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            내 일정 (밴쿠버 기준)
          </h1>
          <PrimaryLinkButton href="/plans/add">
            + 일정 추가
          </PrimaryLinkButton>
        </div>

        <div className="space-y-4">
          {plans?.length ? (
            plans.map((plan) => {
              // UTC 시간을 밴쿠버 시간으로 변환
              const vancouverTime = new Intl.DateTimeFormat("ko-KR", {
                timeZone: USER_TIMEZONE,
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(plan.start_time));

              return (
                <div
                  key={plan.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start" // items-center에서 items-start로 변경 제안
                >
                  {/* 왼쪽: 주요 정보 */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {plan.title}
                    </h3>
                    <p className="text-blue-600 font-medium mt-1">
                      🇨🇦 밴쿠버: {vancouverTime}
                    </p>
                  </div>

                  {/* 오른쪽: 메타 정보 및 액션 버튼 */}
                  <div className="text-right flex flex-col justify-between h-full min-h-[80px]">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        UTC 기준
                      </span>
                      <p className="text-sm text-gray-500 font-mono">
                        {new Date(plan.start_time).toUTCString()}
                      </p>
                    </div>

                    {/* 삭제 버튼 추가 영역 */}
                    <div className="mt-4 flex justify-end gap-2">
                      {/* 나중에 수정 버튼도 여기에 추가하면 좋습니다 */}
                      <DeletePlanButton planId={plan.id} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">
                등록된 일정이 없습니다. 첫 일정을 추가해보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
