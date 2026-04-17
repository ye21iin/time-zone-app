"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  convertToUtc,
  deriveCityFromTimeZone,
  formatDateInputValue,
  getSuggestedPlanDateTime,
} from "@/utils/time";
import FormPage from "@/components/form/FormPage";
import TimeZoneComboBox from "@/components/TimeZoneComboBox";

interface Friend {
  id: string;
  name: string;
  city: string;
  city_timezone: string;
}

export default function AddPlanForm({ friends }: { friends: Friend[] }) {
  const router = useRouter();
  const defaultDateTime = useMemo(() => getSuggestedPlanDateTime(), []);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDateTime.date);
  const [time, setTime] = useState(defaultDateTime.time);
  const [timezone, setTimezone] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const timeZones = useMemo(() => Intl.supportedValuesOf("timeZone").sort(), []);
  const timeZoneOptions = useMemo(() => {
    const friendOptions = friends.map((friend) => ({
      value: friend.city_timezone,
      label: `${friend.name} (${friend.city}) • ${friend.city_timezone}`,
      searchText: `${friend.name} ${friend.city} ${friend.city_timezone}`,
    }));
    const seen = new Set(friendOptions.map((option) => option.value));
    const timezoneOptions = timeZones
      .filter((timezone) => !seen.has(timezone))
      .map((timezone) => ({ value: timezone }));

    return [...friendOptions, ...timezoneOptions];
  }, [friends, timeZones]);
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneToUse = timezone || browserTimezone;
  const selectedFriend = friends.find(
    (friend) => friend.city_timezone === timezoneToUse
  );
  const selectedCity =
    selectedFriend?.city || deriveCityFromTimeZone(timezoneToUse);
  const quickDates = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      { label: "Today", value: formatDateInputValue(today) },
      { label: "Tomorrow", value: formatDateInputValue(tomorrow) },
    ];
  }, []);
  const quickTimes = [
    { label: "Closest time", value: defaultDateTime.time },
    { label: "09:00", value: "09:00" },
    { label: "12:00", value: "12:00" },
    { label: "18:00", value: "18:00" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
        city: selectedCity,
        start_time: utcDate.toISOString(),
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
          <div className="mt-2 flex flex-wrap gap-2">
            {quickDates.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setDate(option.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  date === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
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
          <div className="mt-2 flex flex-wrap gap-2">
            {quickTimes.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setTime(option.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  time === option.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Closest time picks the next 30-minute time from now.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <TimeZoneComboBox
          label="Time zone"
          value={timezone}
          onChange={setTimezone}
          timeZones={timeZones}
          options={timeZoneOptions}
          placeholder="Search a city, friend, or time zone"
        />
        <div className="mt-3 space-y-1 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-500">
            {timezone
              ? `Saved as ${timezoneToUse} local time`
              : `If you leave this empty, we will use your browser timezone: ${timezoneToUse}`}
          </p>
          <p className="text-sm font-medium text-gray-900">
            Event city: {selectedCity}
          </p>
        </div>
      </div>
    </FormPage>
  );
}
