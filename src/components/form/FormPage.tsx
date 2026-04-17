"use client";

import type React from "react";

export interface FormPageProps {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: React.ReactNode;
  submitLabel: string;
  submitLoadingLabel?: string;
  loading?: boolean;
}

export default function FormPage({
  title,
  onSubmit,
  children,
  submitLabel,
  submitLoadingLabel = "Saving...",
  loading = false,
  isModal = false,
}: FormPageProps & { isModal?: boolean }) {
  const FormContent = (
    <div
      className={
        isModal
          ? "px-6 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7"
          : "max-w-md mx-auto mt-12 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      }
    >
      <h1
        className={`${isModal ? "text-2xl mb-7" : "text-2xl mb-8"} text-center font-bold text-gray-900 dark:text-slate-100`}
      >
        {title}
      </h1>

      <form onSubmit={onSubmit} className={isModal ? "space-y-7" : "space-y-6"}>
        {children}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:bg-gray-300 dark:bg-blue-500 dark:hover:bg-blue-400 dark:disabled:bg-slate-700"
        >
          {loading ? submitLoadingLabel : submitLabel}
        </button>
      </form>
    </div>
  );

  // 모달일 때는 감싸는 레이아웃 없이 내용만 반환
  if (isModal) return FormContent;

  // 페이지일 때는 기존처럼 전체 레이아웃 포함
  return <main className="min-h-screen bg-gray-50 p-8 dark:bg-slate-950">{FormContent}</main>;
}
