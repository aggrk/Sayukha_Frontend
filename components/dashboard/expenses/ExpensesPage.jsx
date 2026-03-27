"use client";

import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import api from "../../../lib/api";
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  Undo2,
  ChevronDown,
  X,
} from "lucide-react";
import Pagination from "../../ui/Pagination";
import { LIMIT } from "../../../lib/utils";
import ExpenseModal from "./ExpenseModal";
import DeleteModal from "./DeleteModal";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import axios from "axios";

const UNDO_TIMEOUT = 30;

// Date preset helpers
const DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Custom", value: "custom" },
];

function getDateRange(preset) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (preset === "today") {
    const today = fmt(now);
    return { from: today, to: today };
  }
  if (preset === "week") {
    const day = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday start
    const from = new Date(now);
    from.setDate(now.getDate() - day);
    return { from: fmt(from), to: fmt(now) };
  }
  if (preset === "month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: fmt(from), to: fmt(now) };
  }
  return null;
}

export default function ExpensesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const [undoState, setUndoState] = useState(null);

  // ── Filters ────────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(""); // category id
  const [datePreset, setDatePreset] = useState("");             // today | week | month | custom | ""
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ── Categories for filter dropdown ────────────────────────────────────
  const { data: categoriesData } = useFetch("categories", "/categories");
  const categories = categoriesData?.data ?? [];

  // ── Build query params from active filters ─────────────────────────────
  const filterParams = (() => {
    const params = { page: currentPage, limit: LIMIT };

    if (selectedCategory) params.category_id = selectedCategory;

    const range =
      datePreset === "custom"
        ? { from: customFrom, to: customTo }
        : datePreset
          ? getDateRange(datePreset)
          : null;

    if (range?.from) params["expense_date[gte]"] = range.from;
    if (range?.to)   params["expense_date[lte]"] = range.to;

    return params;
  })();

  const {
    data: expenses,
    isLoading,
    isError,
  } = useFetch("expenses", "/expenses", filterParams);

  const records = expenses?.data ?? [];
  const totalCount = expenses?.results ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const hasActiveFilters = selectedCategory || datePreset;

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, datePreset, customFrom, customTo]);

  // Clear undo timer on unmount
  useEffect(() => {
    return () => {
      if (undoState?.timerId) clearInterval(undoState.timerId);
    };
  }, [undoState?.timerId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setDatePreset("");
    setCustomFrom("");
    setCustomTo("");
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory((prev) => (prev === id ? "" : id));
    setShowCategoryDropdown(false);
  };

  const handleDatePreset = (value) => {
    setDatePreset((prev) => (prev === value ? "" : value));
    if (value !== "custom") {
      setCustomFrom("");
      setCustomTo("");
    }
  };

  const selectedCategoryName =
    categories.find((c) => String(c.id) === String(selectedCategory))?.name ??
    "Category";

  const handleExportExcel = async () => {
    try {
      const token = api.defaults.headers.common["Authorization"];
      const baseURL = api.defaults.baseURL;
      const response = await axios.get(`${baseURL}/expenses/export/excel`, {
        responseType: "blob",
        headers: { ...(token ? { Authorization: token } : {}) },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 150);
    } catch {
      toast.error("Failed to export expenses");
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsImporting(true);

    try {
      const response = await api.post("/expenses/import/excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const importedIds = response.data.ids ?? [];
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(response.data.message ?? "Expenses imported successfully");

      if (undoState?.timerId) clearInterval(undoState.timerId);
      let secondsLeft = UNDO_TIMEOUT;
      const timerId = setInterval(() => {
        secondsLeft -= 1;
        setUndoState((prev) => (prev ? { ...prev, secondsLeft } : null));
        if (secondsLeft <= 0) {
          clearInterval(timerId);
          setUndoState(null);
        }
      }, 1000);
      setUndoState({ ids: importedIds, secondsLeft, timerId });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to import expenses");
    } finally {
      setIsImporting(false);
    }
  };

  const handleUndo = async () => {
    if (!undoState) return;
    clearInterval(undoState.timerId);
    const idsToDelete = undoState.ids;
    setUndoState(null);
    try {
      await api.delete("/expenses/bulk", { data: { ids: idsToDelete } });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Import undone successfully");
    } catch {
      toast.error("Failed to undo import");
    }
  };

  return (
    <div className="bg-gray-light font-body min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl leading-tight font-bold text-black">
              Expenses
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage all recorded expenses
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="from-green to-green-light inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-md shadow-green-200 transition-all duration-200 hover:-translate-y-px hover:opacity-90"
            >
              <Plus size={16} />
              Add Expense
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="text-green inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isImporting ? (
                <>
                  <div className="border-t-green h-4 w-4 animate-spin rounded-full border-2 border-gray-200" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Import Excel
                </>
              )}
            </button>

            {expenses?.data?.length > 0 && (
              <button
                onClick={handleExportExcel}
                className="text-green inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-gray-50"
              >
                <Download size={16} />
                Export Excel
              </button>
            )}
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-wrap items-center gap-2.5">

          {/* Date presets */}
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleDatePreset(preset.value)}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                datePreset === preset.value
                  ? "border-green bg-green text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-green hover:text-green"
              }`}
            >
              {preset.label}
            </button>
          ))}

          {/* Custom date inputs — only shown when "Custom" is active */}
          {datePreset === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="border-green focus:ring-green rounded-xl border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-offset-0"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                min={customFrom}
                className="border-green focus:ring-green rounded-xl border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-offset-0"
              />
            </div>
          )}

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Category dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown((v) => !v)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                selectedCategory
                  ? "border-green bg-green text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-green hover:text-green"
              }`}
            >
              {selectedCategoryName}
              <ChevronDown
                size={14}
                className={`transition-transform duration-150 ${showCategoryDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 z-20 mt-1.5 max-h-56 min-w-44 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
                {categories.length === 0 ? (
                  <p className="px-4 py-2 text-xs text-gray-400">
                    No categories found
                  </p>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(String(cat.id))}
                      className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors ${
                        String(selectedCategory) === String(cat.id)
                          ? "bg-green-50 text-green font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Clear all filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 transition-colors hover:border-red-200 hover:text-red-400"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>

        {/* ── Undo banner ──────────────────────────────────────────────── */}
        {undoState && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-5 py-3 shadow-sm">
            <p className="text-sm text-gray-600">
              {undoState.ids.length} expense
              {undoState.ids.length !== 1 ? "s" : ""} imported.{" "}
              <span className="text-xs text-gray-400">
                Undo available for {undoState.secondsLeft}s
              </span>
            </p>
            <button
              onClick={handleUndo}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              <Undo2 size={13} />
              Undo
            </button>
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="border-t-green h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200" />
            <p className="text-sm text-gray-400">Loading expenses…</p>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────────── */}
        {isError && (
          <div className="flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16">
            <p className="text-red text-sm font-medium">
              Failed to load expenses. Please try again.
            </p>
          </div>
        )}

        {/* ── Empty ────────────────────────────────────────────────────── */}
        {!isLoading && !isError && records.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
              <Download size={22} className="text-green" />
            </div>
            <p className="text-sm text-gray-400">
              {hasActiveFilters
                ? "No expenses match the selected filters."
                : "No expenses found."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="text-green mt-1 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                <X size={14} /> Clear filters
              </button>
            ) : (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-green mt-1 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                <Plus size={14} /> Add your first expense
              </button>
            )}
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────── */}
        {!isLoading && !isError && records.length > 0 && (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-200 border-collapse text-sm">
              <thead>
                <tr>
                  {[
                    "Date",
                    "Description",
                    "Category",
                    "Amount",
                    "Unit",
                    "Paid By",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="bg-white-soft border-b border-gray-100 px-5 py-3.5 text-left text-[11px] font-bold tracking-widest text-gray-400 uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((expense, index) => (
                  <tr
                    key={expense.id ?? index}
                    className={`border-b border-gray-50 transition-colors duration-150 hover:bg-green-50/50 ${
                      index % 2 === 0 ? "bg-white" : "bg-white-soft"
                    }`}
                  >
                    <td className="px-5 py-3.5 align-middle">
                      <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-600">
                        {expense.expense_date
                          ? new Date(expense.expense_date).toLocaleDateString(
                              "en-GB",
                              { day: "2-digit", month: "short", year: "numeric" },
                            )
                          : "—"}
                      </span>
                    </td>
                    <td className="text-dark max-w-55 truncate px-5 py-3.5 align-middle">
                      {expense.description || "—"}
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <span className="text-green inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold">
                        {expense.category_name || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 align-middle font-bold text-black tabular-nums">
                      {expense.amount != null
                        ? Number(expense.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 align-middle text-gray-500">
                      {expense.unit || "—"}
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="bg-green flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white">
                          {expense.paid_by_name
                            ? expense.paid_by_name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <span className="text-dark">
                          {expense.paid_by_name || "—"}
                        </span>
                      </div>
                    </td>
                    {user?.data?.id === expense.paid_by && (
                      <td className="px-5 py-3.5 align-middle">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditExpense(expense)}
                            className="bg-green-light/10 hover:bg-green-light/20 text-green-light flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                            title="Edit expense"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteExpense(expense)}
                            className="text-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 transition-colors hover:bg-red-100"
                            title="Delete expense"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {!isLoading && !isError && records.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onChange={handlePageChange}
            tableName="expenses"
          />
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {showAddModal && <ExpenseModal onClose={() => setShowAddModal(false)} />}
      {editExpense && (
        <ExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
        />
      )}
      {deleteExpense && (
        <DeleteModal
          expense={deleteExpense}
          onClose={() => setDeleteExpense(null)}
        />
      )}
    </div>
  );
}