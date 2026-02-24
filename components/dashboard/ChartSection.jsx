"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { theme, chartColors } from "../../lib/data";
import { CalendarDays, ChevronDown, X, ArrowRight, Check } from "lucide-react";
import useFetch from "../../hooks/useFetch";

// ─── Filter Options ────────────────────────────────────────────────────────────
const FILTERS = ["Day", "Week", "Month"];

// ─── Date Helpers ──────────────────────────────────────────────────────────────
function toYMD(date) {
  return date.toISOString().split("T")[0];
}

function getDateRange(filter) {
  const now = new Date();

  if (filter === "Day") {
    const today = toYMD(now);
    return { gte: today, lte: today };
  }

  if (filter === "Week") {
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { gte: toYMD(monday), lte: toYMD(sunday) };
  }

  if (filter === "Month") {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { gte: toYMD(firstDay), lte: toYMD(lastDay) };
  }
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl border"
      style={{
        backgroundColor: theme.dark,
        borderColor: "rgba(255,255,255,0.1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p
        className="text-white text-lg font-bold"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {Number(payload[0].value).toLocaleString()} TSH
      </p>
    </div>
  );
}

// ─── Input Style ───────────────────────────────────────────────────────────────
const dateInputStyle = {
  fontFamily: "'Inter', sans-serif",
  color: theme.dark,
  backgroundColor: "#fff",
  borderColor: "#e5e7eb",
};

// ─── Component ────────────────────────────────────────────────────────────────
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
    <section
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: theme.whiteSoft,
        borderColor: theme.graySoft,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        className="px-7 py-5 flex flex-col gap-4 border-b"
        style={{ borderColor: theme.graySoft }}
      >
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Expense Breakdown
            </h2>
            <p
              className="text-sm text-gray-400 mt-0.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {dateLabel
                ? `Showing data for ${dateLabel}`
                : `Distribution across categories — this ${activeFilter.toLowerCase()}`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Pills */}
            <div
              className="flex items-center gap-1 p-1 rounded-full"
              style={{ backgroundColor: theme.graySoft }}
            >
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    handleClearDate();
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    backgroundColor:
                      activeFilter === filter && !hasDateFilter
                        ? theme.dark
                        : "transparent",
                    color:
                      activeFilter === filter && !hasDateFilter
                        ? "#fff"
                        : "#9ca3af",
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Date Trigger Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDatePicker((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 shadow-sm"
                style={{
                  borderColor: hasDateFilter ? theme.green : "#e5e7eb",
                  color: hasDateFilter ? theme.green : "#6b7280",
                  backgroundColor: hasDateFilter ? `${theme.green}10` : "#fff",
                }}
              >
                <CalendarDays size={14} />
                <span>{hasDateFilter ? dateLabel : "Filter by Date"}</span>
                <ChevronDown
                  size={13}
                  className="transition-transform duration-200"
                  style={{
                    transform: showDatePicker
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              {hasDateFilter && (
                <button
                  onClick={handleClearDate}
                  className="flex items-center justify-center w-8 h-8 rounded-xl border transition-all duration-200 hover:bg-red-50 hover:border-red-200 group shadow-sm"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#fff" }}
                  title="Clear date filter"
                >
                  <X
                    size={14}
                    className="text-gray-400 group-hover:text-red-400 transition-colors"
                  />
                </button>
              )}
            </div>

            {/* Total */}
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Total
              </p>
              <p
                className="text-xl font-bold mt-0.5"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: theme.green,
                }}
              >
                {totalExpense.toLocaleString()} TSH
              </p>
            </div>

            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${theme.green}15`,
                color: theme.green,
              }}
            >
              {hasDateFilter ? "Custom" : activeFilter} View
            </div>
          </div>
        </div>

        {/* ─── Date Picker Panel ──────────────────────────────────────────────── */}
        {showDatePicker && (
          <div
            className="rounded-2xl border p-5 flex flex-col gap-5 shadow-sm"
            style={{ backgroundColor: "#fff", borderColor: "#e5e7eb" }}
          >
            {/* Mode Toggle */}
            <div className="flex items-center gap-3">
              <p
                className="text-[11px] font-bold uppercase tracking-widest text-gray-400"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Mode
              </p>
              <div
                className="flex items-center gap-1 p-1 rounded-xl"
                style={{ backgroundColor: theme.graySoft }}
              >
                {[
                  { key: "single", label: "Single Date" },
                  { key: "range", label: "Date Range" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setDateMode(key)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{
                      backgroundColor:
                        dateMode === key ? theme.dark : "transparent",
                      color: dateMode === key ? "#fff" : "#9ca3af",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="flex items-end gap-4 flex-wrap">
              {dateMode === "single" ? (
                <div className="flex flex-col gap-1.5 flex-1 min-w-40">
                  <label
                    className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <CalendarDays size={12} />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="text-sm px-4 py-2.5 rounded-xl border outline-none"
                    style={dateInputStyle}
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-40">
                    <label
                      className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <CalendarDays size={12} />
                      From
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="text-sm px-4 py-2.5 rounded-xl border outline-none"
                      style={dateInputStyle}
                    />
                  </div>

                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full mb-0.5 shrink-0"
                    style={{ backgroundColor: theme.graySoft }}
                  >
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 min-w-40">
                    <label
                      className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <CalendarDays size={12} />
                      To
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      min={fromDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="text-sm px-4 py-2.5 rounded-xl border outline-none"
                      style={dateInputStyle}
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-0.5">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 shadow-sm hover:opacity-90"
                  style={{ backgroundColor: theme.dark }}
                >
                  <Check size={13} />
                  Apply
                </button>
                <button
                  onClick={handleClearDate}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-400 group"
                  style={{
                    borderColor: "#e5e7eb",
                    color: "#9ca3af",
                    backgroundColor: "#fff",
                  }}
                >
                  <X size={13} className="group-hover:text-red-400" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="px-7 pt-6 pb-2" style={{ minHeight: 290 }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p
              className="text-sm text-gray-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Loading chart...
            </p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <CalendarDays size={32} className="text-gray-300" />
            <p
              className="text-sm text-gray-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              No expense data for this period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData}
              barSize={48}
              margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 4"
                stroke={theme.graySoft}
                vertical={false}
              />
              <XAxis
                dataKey="category_name"
                tick={{
                  fontSize: 12,
                  fill: "#9ca3af",
                  fontFamily: "'Inter', sans-serif",
                }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#9ca3af",
                  fontFamily: "'Inter', sans-serif",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0.03)", rx: 6 }}
              />
              <Bar dataKey="total_amount" radius={[8, 8, 2, 2]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend + Stats */}
      <div
        className="px-7 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t"
        style={{ borderColor: theme.graySoft }}
      >
        {chartData.map((item, i) => (
          <div
            key={item.category_name}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-1 h-10 rounded-full shrink-0 transition-all duration-300 group-hover:h-12"
              style={{ backgroundColor: chartColors[i % chartColors.length] }}
            />
            <div>
              <p className="text-[11px] text-gray-400 font-medium capitalize">
                {item.category_name}
              </p>
              <p
                className="text-sm font-bold text-gray-800 mt-0.5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {Number(item.total_amount).toLocaleString()} TSH
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
