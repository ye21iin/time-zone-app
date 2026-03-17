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
            My plans (Vancouver time)
          </h1>
          <PrimaryLinkButton href="/plans/add">
            + New plan
          </PrimaryLinkButton>
        </div>

        <div className="space-y-4">
          {plans?.length ? (
            plans.map((plan) => {
              const vancouverTime = new Intl.DateTimeFormat("en-CA", {
                timeZone: USER_TIMEZONE,
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(plan.start_time));

              return (
                <div
                  key={plan.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {plan.title}
                    </h3>
                    <p className="text-blue-600 font-medium mt-1">{`🇨🇦 Vancouver: ${vancouverTime}`}</p>
                  </div>

                  <div className="text-right flex flex-col justify-between h-full min-h-[80px]">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        UTC
                      </span>
                      <p className="text-sm text-gray-500 font-mono">
                        {new Date(plan.start_time).toUTCString()}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <DeletePlanButton planId={plan.id} />
                    </div>
                  </div>
                </div>
              );
            })
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">
                  You don&apos;t have any plans yet. Create your first one!
                </p>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}
