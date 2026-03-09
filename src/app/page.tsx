import { supabase } from "@/lib/supabase";
import TimeCard from "@/components/TimeCard";

export default async function Home() {
  const { data: friends } = await supabase.from("friends").select("*");

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        친구들 시간대 확인
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends?.map((friend) => (
          <TimeCard
            key={friend.id}
            name={friend.name}
            city={friend.city}
            timezone={friend.city_timezone}
          />
        ))}
      </div>
    </main>
  );
}
