"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { convertToUtc } from "@/utils/time";
import FormPage from "@/components/form/FormPage";

interface Friend {
  id: string;
  name: string;
  city: string;
  city_timezone: string;
}

export default function AddPlanForm({ friends }: { friends: Friend[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const timeZones = Intl.supportedValuesOf("timeZone").sort();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToUse = timezone || browserTimezone;
    if (!timezone) setTimezone(timezoneToUse);

    const utcDate = convertToUtc(date, time, timezoneToUse);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You need to be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("plans").insert([
      {
        user_id: user.id,
        title,
        start_time: utcDate.toISOString(),
        end_time: utcDate.toISOString(),
      },
    ]);

    if (error) {
      alert("Failed to save: " + error.message);
    } else {
      alert("Your plan has been added.");
      router.push("/plans");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <FormPage
      title="Create a new plan"
      onSubmit={handleSubmit}
      submitLabel="Save plan"
      submitLoadingLabel="Saving..."
      loading={loading}
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          required
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="e.g. Team meeting"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            value={time}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTime(e.target.value)
            }
          />
        </div>
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
        >
          <option value="" disabled>
            Select a time zone
          </option>
          {friends.length > 0 ? (
            <optgroup label="Friends">
              {friends.map((f) => (
                <option key={f.id} value={f.city_timezone} className="text-gray-900">
                  {f.name} ({f.city})
                </option>
              ))}
            </optgroup>
          ) : null}
          <optgroup label="All time zones">
            {timeZones.map((tz) => (
              <option key={tz} value={tz} className="text-gray-900">
                {tz}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
    </FormPage>
  );
}
