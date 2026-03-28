// src/app/friends/page.tsx
import DeleteFriendButton from "@/components/DeleteFriendButton";
import PrimaryLinkButton from "@/components/PrimaryLinkButton";
import TimeCard from "@/components/TimeCard";
import { USER_CITY, USER_TIMEZONE } from "@/lib/constant";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FriendsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: friends } = await supabase
    .from("friends")
    .select("*")
    .eq("user_id", user.id);

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-12">
      {/* 모든 콘텐츠를 감싸는 중앙 정렬 컨테이너 (Navbar와 동일한 5xl) */}
      <div className="max-w-5xl mx-auto space-y-12">
        {/* 내 시간 섹션 */}
        <section>
          <h2 className="text-xl font-bold text-gray-700 mb-6 uppercase tracking-wider text-sm">
            My Current Location
          </h2>
          {/* Grid 시스템을 활용해 '내 카드'도 친구 카드와 동일한 너비를 갖게 함 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TimeCard
              isMe
              name="Me"
              city={USER_CITY}
              timezone={USER_TIMEZONE}
            />
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* 친구 목록 섹션 */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Friends</h1>
            <PrimaryLinkButton href="/friends/add">
              + Add friend
            </PrimaryLinkButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends?.length ? (
              friends.map((friend) => (
                <div key={friend.id} className="relative group h-full">
                  <TimeCard
                    friendId={friend.id}
                    editableName
                    name={friend.name}
                    city={friend.city}
                    timezone={friend.city_timezone}
                  />

                  <div className="absolute bottom-6 right-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-75 ease-out flex flex-col items-end gap-1">
                    <DeleteFriendButton
                      friendId={friend.id}
                      name={friend.name}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                No friends added yet. Start by adding a friend!
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
