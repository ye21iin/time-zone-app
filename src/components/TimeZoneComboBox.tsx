"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function normalizeTimezoneQuery(query: string) {
  return query.trim().toLowerCase();
}

type TimeZoneOption = {
  value: string;
  label?: string;
  searchText?: string;
};

export default function TimeZoneComboBox({
  label,
  value,
  onChange,
  timeZones,
  options,
  placeholder = "Search time zones (e.g. Asia/Seoul)",
}: {
  label: string;
  value: string;
  onChange: (timezone: string) => void;
  timeZones: string[];
  options?: TimeZoneOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const entries = useMemo<TimeZoneOption[]>(
    () =>
      options && options.length > 0
        ? options
        : timeZones.map((timezone) => ({ value: timezone })),
    [options, timeZones],
  );

  const filtered = useMemo(() => {
    const q = normalizeTimezoneQuery(query);

    const MAX_RESULTS = 20;
    if (!q) {
      const ordered: TimeZoneOption[] = [];
      if (value) {
        const selected = entries.find((entry) => entry.value === value);
        if (selected) ordered.push(selected);
      }
      for (const entry of entries) {
        if (entry.value === value) continue;
        ordered.push(entry);
        if (ordered.length >= MAX_RESULTS) break;
      }
      return ordered;
    }

    const scored = entries
      .map((entry) => {
        const searchTarget = `${entry.value} ${entry.label ?? ""} ${entry.searchText ?? ""}`.toLowerCase();
        const idx = searchTarget.indexOf(q);
        return idx === -1
          ? null
          : {
              entry,
              score: (searchTarget.startsWith(q) ? 0 : 1) * 10000 + idx,
            };
      })
      .filter(
        (v): v is {
          entry: TimeZoneOption;
          score: number;
        } => v !== null,
      )
      .sort((a, b) => a.score - b.score);

    return scored.slice(0, MAX_RESULTS).map((s) => s.entry);
  }, [entries, query, value]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function selectTimezone(next: string) {
    onChange(next);
    setQuery(next);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div ref={rootRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={open ? query : value}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            setQuery(value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={(e) => {
            if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
              setQuery(value);
              setOpen(true);
              setActiveIndex(-1);
              return;
            }

            if (!open) return;

            if (e.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) => {
                const next = prev + 1;
                return next >= filtered.length ? 0 : next;
              });
              return;
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((prev) => {
                const next = prev - 1;
                return next < 0 ? filtered.length - 1 : next;
              });
              return;
            }

            if (e.key === "Enter") {
              e.preventDefault();
              const nextIndex =
                activeIndex >= 0 && activeIndex < filtered.length
                  ? activeIndex
                  : 0;
              if (filtered.length > 0) selectTimezone(filtered[nextIndex].value);
              return;
            }
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls="timezone-listbox"
          aria-autocomplete="list"
          className={`w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 transition-all ${
            open ? "ring-2" : ""
          }`}
        />

        {open ? (
          <ul
            id="timezone-listbox"
            role="listbox"
            className="absolute z-10 mt-2 w-full max-h-64 overflow-auto rounded-xl bg-white border border-gray-100 shadow-lg"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                No time zones found.
              </li>
            ) : (
              filtered.map((entry, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = entry.value === value;
                return (
                  <li
                    key={`${entry.value}-${entry.label ?? idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      // Prevent input blur before selection.
                      e.preventDefault();
                      selectTimezone(entry.value);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`px-3 py-2 text-sm cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {entry.label ?? entry.value}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
