// src/app/friends/page.tsx
import DeleteFriendButton from "@/components/DeleteFriendButton";
import PrimaryLinkButton from "@/components/PrimaryLinkButton";
import TimeCard from "@/components/TimeCard";
import { USER_CITY, USER_TIMEZONE } from "@/lib/constant";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FriendsPage() {
  const supabase = await createClient();

  // 1. 현재 로그인한 유저 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 만약 미들웨어에서 놓쳤을 경우를 대비한 안전장치
  if (!user) {
    redirect("/auth/login");
  }

  // 2. 이 유저가 등록한 친구들만 가져오기 (user_id 필드가 있다고 가정)
  const { data: friends } = await supabase
    .from("friends")
    .select("*")
    .eq("user_id", user.id); // 내 친구만 필터링!

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-12">
      {/* 1. 나의 고정 카드 섹션 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-700 mb-4">현재 나의 시간</h2>
        <div className="max-w-sm">
          <TimeCard
            isMe={true}
            name="나"
            city={USER_CITY}
            timezone={USER_TIMEZONE}
          />
        </div>
      </section>

      {/* 2. 친구 목록 섹션 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">친구들</h1>
        <PrimaryLinkButton href="/friends/add">+ 친구 추가</PrimaryLinkButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends?.length ? (
          friends.map((friend) => (
            // 1. group 클래스를 추가하여 마우스 오버 효과 준비
            <div key={friend.id} className="relative group">
              <TimeCard
                name={friend.name}
                city={friend.city}
                timezone={friend.city_timezone}
              />

              {/* 2. 카드 우측 하단에 삭제 버튼 배치 */}
              {/* top-4 right-4 대신 bottom-4 right-4를 사용하여 이모지와 겹침 방지 */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-1">
                {/* 필요한 경우 수정 버튼을 여기에 추가할 수 있습니다 */}
                <DeleteFriendButton friendId={friend.id} name={friend.name} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">아직 등록된 친구가 없습니다.</p>
        )}
      </div>
    </main>
  );
}
