// components/ui/MonthPicker.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthPicker({
  value,
  onChange,
  placeholder = "Pick a month",
}) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const ref = useRef(null);

  const parsed = value
    ? {
        year: parseInt(value.split("-")[0]),
        month: parseInt(value.split("-")[1]) - 1,
      }
    : null;

  const displayLabel = parsed
    ? `${MONTHS[parsed.month]} ${parsed.year}`
    : placeholder;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (monthIndex) => {
    const mm = String(monthIndex + 1).padStart(2, "0");
    onChange(`${year}-${mm}`);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex h-9.5 min-w-43.75 cursor-pointer items-center gap-2 rounded-xl border bg-white px-3 text-sm transition-all ${open ? "border-green-400 ring-2 ring-green-100" : "border-green-200"} ${parsed ? "text-gray-700" : "text-gray-400"}`}
      >
        <CalendarDays size={14} className="shrink-0 text-green-500" />
        <span className="flex-1 text-left font-medium">{displayLabel}</span>
        {parsed ? (
          <X
            size={13}
            className="shrink-0 text-gray-400 hover:text-red-400"
            onClick={handleClear}
          />
        ) : (
          <ChevronRight
            size={13}
            className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-xl">
          {/* Year navigation */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="font-heading text-sm font-bold text-gray-700">
              {year}
            </span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1.5 p-3">
            {MONTHS.map((month, i) => {
              const isSelected = parsed?.month === i && parsed?.year === year;
              const isCurrentMonth =
                new Date().getMonth() === i &&
                new Date().getFullYear() === year;
              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-green text-white shadow-sm"
                      : isCurrentMonth
                        ? "border border-green-200 bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
