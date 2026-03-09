import { supabase } from "@/lib/supabase";

// 시간 계산 헬퍼 함수
function getLocalTime(timezone: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

export default async function Home() {
  const { data: friends } = await supabase.from("friends").select("*");

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        친구들 시간대 확인
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends?.map((friend) => (
          <div
            key={friend.id}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {friend.name}
                </h2>
                <p className="text-blue-600 font-medium mt-1">{friend.city}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-full">
                <span className="text-2xl">🕒</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-4xl font-bold text-gray-800 tracking-tight">
                {getLocalTime(friend.city_timezone)}
              </p>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">
                Timezone
              </p>
              <p className="text-sm font-mono text-gray-600 mt-1">
                {friend.city_timezone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
