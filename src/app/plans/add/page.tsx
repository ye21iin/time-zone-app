// src/app/plans/add/page.tsx
import AddPlanForm from "@/components/AddPlanForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AddPlanPage() {
  const supabase = await createClient();

  // 친구 목록을 가져와야 폼에서 도시 선택이 가능합니다.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: friends } = await supabase
    .from("friends")
    .select("*")
    .eq("user_id", user.id);

  return <AddPlanForm friends={friends || []} />;
}
