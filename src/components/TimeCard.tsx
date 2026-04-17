"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TimeCard({
  timezone,
  name,
  city,
  isMe = false,
  friendId,
  editableName = false,
}: {
  timezone: string;
  name: string;
  city: string;
  isMe?: boolean;
  friendId?: string;
  editableName?: boolean;
}) {
  const [time, setTime] = useState("");
  const [displayName, setDisplayName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setDisplayName(name);
    setDraftName(name);
  }, [name]);

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const canEditName = Boolean(editableName && friendId && !isMe);

  const startEditing = () => {
    if (!canEditName) return;
    setDraftName(displayName);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftName(displayName);
    setIsEditing(false);
  };

  const saveName = async () => {
    if (!canEditName) return;
    const next = draftName.trim();
    if (!next || next === displayName) {
      setDraftName(displayName);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from("friends")
      .update({ name: next })
      .eq("id", friendId);

    setIsSaving(false);

    if (error) {
      alert("Failed to update name: " + error.message);
      return;
    }

    setDisplayName(next);
    setIsEditing(false);
    router.refresh();
  };

  return (
    <div
      className={`flex h-full transform flex-col rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 group-hover:-translate-y-1 dark:bg-slate-900 
    ${
      isMe
        ? "border-blue-500 ring-4 ring-blue-50 dark:ring-blue-950/50"
        : "border-gray-100 hover:shadow-xl group-hover:shadow-xl dark:border-slate-800"
    }`}
    >
      {/* 상단 섹션: 이름, 도시, 아이콘 */}
      <div className="flex justify-between items-start mb-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {isEditing ? (
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => void saveName()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void saveName();
                  if (e.key === "Escape") cancelEditing();
                }}
                autoFocus
                disabled={isSaving}
                className="w-full max-w-[18ch] rounded-md border border-gray-200 bg-white px-2 py-1 text-2xl font-bold text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            ) : (
              <span className="inline-flex items-center gap-2">
                <span
                  onDoubleClick={startEditing}
                  className={
                    canEditName ? "cursor-text select-text" : undefined
                  }
                >
                  {displayName}
                </span>
                {canEditName && (
                  <button
                    onClick={startEditing}
                    className="inline-flex items-center justify-center rounded p-1 text-gray-300 transition-colors hover:bg-gray-50 hover:text-gray-500 md:opacity-0 md:group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                )}
              </span>
            )}
            {isMe && (
              <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
                (You)
              </span>
            )}
          </h2>
          <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">{city}</p>
        </div>

        <div className="shrink-0 rounded-full bg-blue-50 p-2 dark:bg-blue-950/50">
          <span className="text-2xl">{isMe ? "🏠" : "🕒"}</span>
        </div>
      </div>

      {/* 하단 섹션: 시간 및 타임존 */}
      <div className="mt-8 border-t border-gray-100 pt-8 dark:border-slate-800">
        <p className="font-mono text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
          {time || "Loading..."}
        </p>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
            Timezone
          </p>
          <p
            className="mt-1 truncate text-sm font-medium text-gray-500 dark:text-slate-400"
            title={timezone}
          >
            {timezone}
          </p>
        </div>
      </div>
    </div>
  );
}
