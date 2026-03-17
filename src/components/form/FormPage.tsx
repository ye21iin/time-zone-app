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
  submitLoadingLabel = "저장 중...",
  loading = false,
}: FormPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <section className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">
          {title}
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-md"
          >
            {loading ? submitLoadingLabel : submitLabel}
          </button>
        </form>
      </section>
    </main>
  );
}

