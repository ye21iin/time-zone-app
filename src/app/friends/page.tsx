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
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          My current time
        </h2>
        <div className="max-w-sm">
          <TimeCard
            isMe
            name="Me"
            city={USER_CITY}
            timezone={USER_TIMEZONE}
          />
        </div>
      </section>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Friends</h1>
        <PrimaryLinkButton href="/friends/add">+ Add friend</PrimaryLinkButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends?.length ? (
          friends.map((friend) => (
            <div key={friend.id} className="relative group">
              <TimeCard
                name={friend.name}
                city={friend.city}
                timezone={friend.city_timezone}
              />

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-1">
                <DeleteFriendButton friendId={friend.id} name={friend.name} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No friends added yet.</p>
        )}
      </div>
    </main>
  );
}
