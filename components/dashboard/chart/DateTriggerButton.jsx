import { CalendarDays, ChevronDown, X } from "lucide-react";

export default function DateTriggerButton({
  hasDateFilter,
  dateLabel,
  showDatePicker,
  setShowDatePicker,
  handleClearDate,
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowDatePicker((prev) => !prev)}
        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-200 ${hasDateFilter ? "border-green text-green bg-green/10" : "border-gray-200 bg-white text-gray-500"}`}
      >
        <CalendarDays size={14} />
        <span>{hasDateFilter ? dateLabel : "Filter by Date"}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${showDatePicker ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {hasDateFilter && (
        <button
          onClick={handleClearDate}
          className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-[#e5e7eb] bg-white shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50"
          title="Clear date filter"
        >
          <X
            size={14}
            className="text-gray-400 transition-colors group-hover:text-red-400"
          />
        </button>
      )}
    </div>
  );
}
