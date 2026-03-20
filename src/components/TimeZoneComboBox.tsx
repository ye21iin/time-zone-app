"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function normalizeTimezoneQuery(query: string) {
  return query.trim().toLowerCase();
}

export default function TimeZoneComboBox({
  label,
  value,
  onChange,
  timeZones,
  placeholder = "Search time zones (e.g. Asia/Seoul)",
}: {
  label: string;
  value: string;
  onChange: (timezone: string) => void;
  timeZones: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const q = normalizeTimezoneQuery(query);

    const MAX_RESULTS = 20;
    if (!q) {
      // When empty, show the selected value first (if any) and then top items.
      const ordered: string[] = [];
      if (value) ordered.push(value);
      for (const tz of timeZones) {
        if (tz === value) continue;
        ordered.push(tz);
        if (ordered.length >= MAX_RESULTS) break;
      }
      return ordered;
    }

    const scored = timeZones
      .map((tz) => {
        const lower = tz.toLowerCase();
        const idx = lower.indexOf(q);
        return idx === -1
          ? null
          : {
              tz,
              // Prefer prefix matches; otherwise prefer earlier matches.
              score: (lower.startsWith(q) ? 0 : 1) * 10000 + idx,
            };
      })
      .filter(
        (v): v is {
          tz: string;
          score: number;
        } => v !== null,
      )
      .sort((a, b) => a.score - b.score);

    return scored.slice(0, MAX_RESULTS).map((s) => s.tz);
  }, [query, timeZones, value]);

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
              if (filtered.length > 0) selectTimezone(filtered[nextIndex]);
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
              filtered.map((tz, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = tz === value;
                return (
                  <li
                    key={tz}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      // Prevent input blur before selection.
                      e.preventDefault();
                      selectTimezone(tz);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`px-3 py-2 text-sm cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tz}
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

