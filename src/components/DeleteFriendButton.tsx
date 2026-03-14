"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteFriendButton({
  friendId,
  name,
}: {
  friendId: string;
  name: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (
      !confirm(
        `${name}님을 친구 목록에서 삭제하시겠습니까?\n등록된 일정은 유지됩니다.`
      )
    )
      return;

    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("id", friendId);

    if (error) {
      alert("삭제 실패: " + error.message);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      // 디자인 수정:
      // 1. 글자색을 더 연한 회색(gray-400)으로 변경하여 평소엔 눈에 덜 띄게 함
      // 2. hover 시에만 빨간색(red-500)으로 변하게 하여 시각적 피드백 제공
      className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
    >
      Delete
    </button>
  );
}
