"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeletePlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("정말 이 일정을 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("plans").delete().eq("id", planId);

    if (error) {
      alert("삭제 실패: " + error.message);
    } else {
      router.refresh(); // 페이지 새로고침하여 목록 갱신
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-600 transition p-2"
    >
      삭제
    </button>
  );
}
