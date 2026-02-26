"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import { getDateRange } from "../../../lib/utils";
import TotalExpense from "./TotalExpense";
import DatepickerPanel from "./DatepickerPanel";
import ChartArea from "./ChartArea";
import LegendStats from "./LegendStats";
import DateTriggerButton from "./DateTriggerButton";

// ─── Filter Options ────────────────────────────────────────────────────────────
const FILTERS = ["Day", "Week", "Month"];

export default function ChartSection() {
  const [activeFilter, setActiveFilter] = useState("Month");
  const [dateMode, setDateMode] = useState("single");
  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const hasDateFilter =
    (dateMode === "single" && singleDate) ||
    (dateMode === "range" && fromDate && toDate);

  // ─── Build Params ──────────────────────────────────────────────────────────
  const buildParams = () => {
    if (hasDateFilter) {
      if (dateMode === "single") {
        return {
          "expense_date[gte]": singleDate,
          "expense_date[lte]": singleDate,
        };
      }
      return {
        "expense_date[gte]": fromDate,
        "expense_date[lte]": toDate,
      };
    }

    const { gte, lte } = getDateRange(activeFilter);
    return {
      "expense_date[gte]": gte,
      "expense_date[lte]": lte,
    };
  };

  const params = buildParams();

  const { data: expensesStats, isLoading } = useFetch(
    "expenses-stats",
    "/expenses/stats",
    params,
  );

  const chartData = expensesStats?.data ?? [];
  const totalExpense = chartData.reduce(
    (sum, d) => sum + Number(d.total_amount ?? 0),
    0,
  );

  const dateLabel = hasDateFilter
    ? dateMode === "single"
      ? singleDate
      : `${fromDate} → ${toDate}`
    : null;

  const handleClearDate = () => {
    setSingleDate("");
    setFromDate("");
    setToDate("");
    setShowDatePicker(false);
  };

  return (
    <section className="border-gray-low-soft bg-white-soft overflow-hidden rounded-2xl border shadow-sm">
      {/* Header */}
      <div className="border-gray-low-soft flex flex-col gap-4 border-b px-7 py-5">
        {/* Top row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-gray-900">
              Expense Breakdown
            </h2>
            <p className="font-body mt-0.5 text-sm text-gray-400">
              {dateLabel
                ? `Showing data for ${dateLabel}`
                : `Distribution across categories — this ${activeFilter.toLowerCase()}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="bg-gray-low-soft flex items-center gap-1 rounded-full p-1">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    handleClearDate();
                  }}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${activeFilter === filter && !hasDateFilter ? "bg-dark text-white" : "bg-transparent text-gray-400"}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Date Trigger Button */}
            <DateTriggerButton
              hasDateFilter={hasDateFilter}
              dateLabel={dateLabel}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              handleClearDate={handleClearDate}
            />

            {/* Total */}
            <TotalExpense totalExpense={totalExpense} />

            <div className="bg-green/15 text-green rounded-full px-3 py-1.5 text-xs font-semibold">
              {hasDateFilter ? "Custom" : activeFilter} View
            </div>
          </div>
        </div>

        {/* ─── Date Picker Panel ──────────────────────────────────────────────── */}
        {showDatePicker && (
          <DatepickerPanel
            handleClearDate={handleClearDate}
            setShowDatePicker={setShowDatePicker}
            dateMode={dateMode}
            setDateMode={setDateMode}
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            singleDate={singleDate}
            setSingleDate={setSingleDate}
          />
        )}
      </div>

      {/* Chart Area */}
      <ChartArea isLoading={isLoading} chartData={chartData} />

      {/* Legend + Stats */}
      <LegendStats chartData={chartData} />
    </section>
  );
}
