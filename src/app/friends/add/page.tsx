"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import FormPage from "@/components/form/FormPage";
import TimeZoneComboBox from "@/components/TimeZoneComboBox";

function deriveCityFromTimeZone(timezone: string) {
  const last = timezone.split("/").filter(Boolean).pop();
  if (!last) return "";
  // e.g. Los_Angeles -> Los Angeles
  return last.replace(/_/g, " ");
}

export default function AddFriendPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const timeZones = useMemo(
    () => Intl.supportedValuesOf("timeZone").sort(),
    [],
  );

  const handleTimezoneChange = (nextTimezone: string) => {
    setTimezone(nextTimezone);
    // Timezone 선택만으로 친구 카드 라벨용 city를 자동 제안.
    setCity(deriveCityFromTimeZone(nextTimezone));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!timezone) return alert("Please select a time zone.");

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You need to be logged in.");
      return;
    }

    const cityToUse = city.trim() || deriveCityFromTimeZone(timezone);

    const { error } = await supabase.from("friends").insert([
      {
        name,
        city: cityToUse,
        city_timezone: timezone,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert("Something went wrong: " + error.message);
    } else {
      router.push("/friends");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <FormPage
      title="Add a new friend"
      onSubmit={handleSubmit}
      submitLabel="Save friend"
      submitLoadingLabel="Saving..."
      loading={loading}
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Friend name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="e.g. Nana"
          required
        />
      </div>

      <TimeZoneComboBox
        label="Time zone"
        value={timezone}
        onChange={handleTimezoneChange}
        timeZones={timeZones}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCity(e.target.value)
          }
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="e.g. Tokyo"
        />
      </div>
    </FormPage>
  );
}
