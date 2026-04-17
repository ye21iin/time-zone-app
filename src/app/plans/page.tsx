import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PrimaryLinkButton from "@/components/PrimaryLinkButton";
import PlansList from "@/components/PlansList";

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
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
            My plans
          </h1>
          <PrimaryLinkButton href="/plans/add">+ New</PrimaryLinkButton>
        </div>

        {/* 기존 plans.map 로직 -> PlansList로 넘깁니다. */}
        {plans && plans.length > 0 ? (
          <PlansList initialPlans={plans} />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">
              You don&apos;t have any plans yet. Create your first one!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
