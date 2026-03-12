// src/app/plans/page.tsx
import { createClient } from "@/lib/supabase/server";
import { USER_TIMEZONE } from "@/lib/constant";
import { redirect } from "next/navigation";

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

  if (plans) {
    console.log(plans);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            내 일정 (밴쿠버 기준)
          </h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            + 일정 추가
          </button>
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
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {plan.title}
                    </h3>
                    <p className="text-blue-600 font-medium mt-1">
                      🇨🇦 밴쿠버: {vancouverTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      UTC 기준
                    </span>
                    <p className="text-sm text-gray-500 font-mono">
                      {new Date(plan.start_time).toUTCString()}
                    </p>
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
