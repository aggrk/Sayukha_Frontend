import { ArrowRight, CalendarDays, Check, X } from "lucide-react";

export default function DatepickerPanel({
  handleClearDate,
  setShowDatePicker,
  dateMode,
  setDateMode,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  setSingleDate,
  singleDate,
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      {/* Mode Toggle */}
      <div className="flex items-center gap-3">
        <p className="font-body text-[11px] font-bold tracking-widest text-gray-400 uppercase">
          Mode
        </p>
        <div className="bg-gray-low-soft flex items-center gap-1 rounded-xl p-1">
          {[
            { key: "single", label: "Single Date" },
            { key: "range", label: "Date Range" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setDateMode(key)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${dateMode === key ? "bg-dark text-white" : "bg-transparent text-gray-400"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-wrap items-end gap-4">
        {dateMode === "single" ? (
          <div className="flex min-w-40 flex-1 flex-col gap-1.5">
            <label className="font-body flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              <CalendarDays size={12} />
              Select Date
            </label>
            <input
              type="date"
              value={singleDate}
              onChange={(e) => setSingleDate(e.target.value)}
              className="font-body text-dark rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm outline-none"
            />
          </div>
        ) : (
          <>
            <div className="flex min-w-40 flex-1 flex-col gap-1.5">
              <label className="font-body flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                <CalendarDays size={12} />
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="font-body text-dark rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="bg-gray-low-soft mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <ArrowRight size={14} className="text-gray-400" />
            </div>

            <div className="flex min-w-40 flex-1 flex-col gap-1.5">
              <label className="font-body flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                <CalendarDays size={12} />
                To
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
                className="font-body text-dark rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm outline-none"
              />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="mb-0.5 flex items-center gap-2">
          <button
            onClick={() => setShowDatePicker(false)}
            className="bg-dark flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90"
          >
            <Check size={13} />
            Apply
          </button>
          <button
            onClick={handleClearDate}
            className="group flex cursor-pointer items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-xs font-semibold text-[#9ca3af] transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-400"
          >
            <X size={13} className="group-hover:text-red-400" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
