// src/app/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 이미 로그인했다면 바로 친구 목록으로
  if (user) {
    redirect("/friends");
  }

  // 로그인 안 했다면 서비스 소개 화면 보여주기
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-4">Time Zone App</h1>
      <p className="text-xl mb-8">
        멀리 떨어진 친구들의 시간을 한눈에 확인하세요.
      </p>
      <a
        href="/auth/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        지금 시작하기
      </a>
    </main>
  );
}
