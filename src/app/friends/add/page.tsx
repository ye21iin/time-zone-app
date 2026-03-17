"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import FormPage from "@/components/form/FormPage";

export default function AddFriendPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const timeZones = Intl.supportedValuesOf("timeZone").sort();

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

    const { error } = await supabase.from("friends").insert([
      {
        name,
        city,
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          value={city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCity(e.target.value)
          }
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="e.g. Tokyo"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Time zone
        </label>
        <select
          value={timezone}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setTimezone(e.target.value)
          }
          className={`w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all ${
            timezone ? "text-gray-900" : "text-gray-400"
          }`}
          required
        >
          <option value="" disabled>
            Select a time zone
          </option>
          {timeZones.map((tz) => (
            <option key={tz} value={tz} className="text-gray-900">
              {tz}
            </option>
          ))}
        </select>
      </div>
    </FormPage>
  );
}
