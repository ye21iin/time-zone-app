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
        `Remove ${name} from your friends list?\nAny related plans will be kept.`
      )
    )
      return;

    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("id", friendId);

    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors duration-100 ease-out px-2 py-1 rounded hover:bg-red-50"
    >
      Delete
    </button>
  );
}
