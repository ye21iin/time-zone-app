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
      type="button"
      title={`Delete ${name}`}
      aria-label={`Delete ${name}`}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    </button>
  );
}
