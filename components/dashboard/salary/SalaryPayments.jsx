"use client";

import { useCallback, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { Banknote, Check, ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { LIMIT, formatCurrency, formatDate } from "../../../lib/utils";
import Pagination from "../../ui/Pagination";
import ActionDropdown from "../employees/ActionDropdown";
import SalaryModal from "../employees/SalaryModal";
import MonthPicker from "../../ui/MonthPicker";
import { useAuth } from "../../../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import toast from "react-hot-toast";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    paid: "bg-green-100 text-green border-green-200",
    partial: "bg-amber-100 text-amber-700 border-amber-200",
    pending: "bg-red-100 text-red border-red-200",
  };
  const label = status?.replace("_", " ") ?? "—";
  const classes = map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${classes}`}
    >
      {label}
    </span>
  );
}

// ─── Inline editable cell ─────────────────────────────────────────────────────

function EditableCell({ type = "text", value, onChange, placeholder = "" }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-w-24 rounded-lg border border-green-300 bg-green-50 px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SalaryPayments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryParams = {
    page: currentPage,
    limit: LIMIT,
    ...(selectedMonth && { payment_month: selectedMonth }),
    ...(selectedStatus && { status: selectedStatus }),
  };

  const {
    data: salaryData,
    isLoading,
    isError,
  } = useFetch("salary-payments", "/salary-payments", queryParams);

  const salaries = salaryData?.data ?? [];
  const totalCount = salaryData?.result ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  // ── Filters ────────────────────────────────────────────────────────────────

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMonthChange = (val) => {
    setSelectedMonth(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedMonth("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedMonth || selectedStatus;

  const handleToggle = useCallback((id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }, []);

  // ── Inline edit ────────────────────────────────────────────────────────────

  const startEdit = (salary) => {
    setEditingId(salary.id);
    setConfirmDeleteId(null);
    const original = {
      month: salary.payment_month?.slice(0, 7) ?? "",
      advance_amount: salary.advance_amount ?? "",
      full_payment_amount: salary.full_payment_amount ?? "",
      notes: salary.notes ?? "",
    };
    // Store _original so saveEdit can diff and only send changed fields
    setEditValues({ ...original, _original: original });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (id) => {
    setSavingId(id);
    try {
      const orig = editValues._original;
      const payload = {};

      // Only include fields the user actually changed
      if (editValues.month !== orig.month) payload.month = editValues.month;
      if (String(editValues.advance_amount) !== String(orig.advance_amount))
        payload.advance_amount = editValues.advance_amount;
      if (
        String(editValues.full_payment_amount) !==
        String(orig.full_payment_amount)
      )
        payload.full_payment_amount = editValues.full_payment_amount;
      if (editValues.notes !== orig.notes) payload.notes = editValues.notes;

      if (Object.keys(payload).length === 0) {
        toast("No changes to save.");
        setEditingId(null);
        return;
      }

      await api.patch(`/salary-payments/${id}`, payload);
      await queryClient.invalidateQueries({ queryKey: ["salary-payments"] });
      setEditingId(null);
      setEditValues({});
      toast.success("Payment record updated.");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to update record.");
    } finally {
      setSavingId(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/salary-payments/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["salary-payments"] });
      setConfirmDeleteId(null);
      toast.success("Payment record deleted.");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {modal && (
        <SalaryModal
          employee={modal.employee}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}

      <div className="font-body min-h-screen py-8">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl leading-tight font-bold text-black">
                Salary Payments
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage all employee salary disbursements
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-gray-light-soft mb-4 flex flex-wrap items-end gap-4 rounded-2xl border border-green-200 px-5 py-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-dark flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
                Payment Month
              </label>
              <MonthPicker value={selectedMonth} onChange={handleMonthChange} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-dark flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
                Status
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="font-body h-9.5 w-44 cursor-pointer appearance-none rounded-xl border border-green-200 bg-white py-2 pr-8 pl-3 text-sm text-gray-600 transition-all outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="ml-auto flex items-center gap-2 self-end pb-0.5">
                {selectedMonth && (
                  <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1 text-[11px] font-semibold text-green-700">
                    {selectedMonth}
                  </span>
                )}
                {selectedStatus && (
                  <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1 text-[11px] font-semibold text-green-700 capitalize">
                    {selectedStatus}
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="cursor-pointer rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-red-400 transition-colors hover:bg-red-50"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
              <div className="border-t-green h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200" />
              <p className="text-sm text-gray-400">Loading salary payments…</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16">
              <p className="text-red text-sm font-medium">
                Failed to load salary payments. Please try again.
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && salaries.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                <Banknote size={22} className="text-green" />
              </div>
              <p className="text-sm text-gray-400">
                {hasActiveFilters
                  ? "No payments match your filters."
                  : "No salary payments found."}
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && salaries.length > 0 && (
            <div className="w-full overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-250 border-collapse text-sm">
                <thead>
                  <tr>
                    {[
                      "Employee",
                      "Payment Month",
                      "Basic Salary",
                      "Advance",
                      "Advance Paid At",
                      "Full Payment",
                      "Full Paid At",
                      "Balance",
                      "Status",
                      "Notes",
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
                  {salaries.map((salary, index) => {
                    const isEditing = editingId === salary.id;
                    const isPaid = salary.status === "paid";
                    const isConfirmingDelete = confirmDeleteId === salary.id;

                    return (
                      <tr
                        key={salary.id ?? index}
                        className={`border-b border-gray-50 transition-colors duration-150 ${
                          isEditing
                            ? "bg-green-50/60"
                            : `hover:bg-green-50/40 ${index % 2 === 0 ? "bg-white" : "bg-white-soft"}`
                        }`}
                      >
                        {/* Employee */}
                        <td className="px-5 py-4 align-middle">
                          <p className="leading-snug font-semibold text-black">
                            {salary.employee_name || "—"}
                          </p>
                          <span className="text-green mt-1 inline-block rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                            ID #{salary.employee_id ?? "N/A"}
                          </span>
                        </td>

                        {/* Payment Month */}
                        <td className="px-5 py-4 align-middle text-gray-600">
                          {isEditing ? (
                            <EditableCell
                              type="month"
                              value={editValues.month}
                              onChange={(v) => handleEditChange("month", v)}
                            />
                          ) : (
                            formatDate(salary.payment_month)
                          )}
                        </td>

                        {/* Basic Salary — never editable */}
                        <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                          {formatCurrency(salary.basic_salary)}
                          <span className="ml-1 text-[10px] font-normal text-gray-400">
                            TSH
                          </span>
                        </td>

                        {/* Advance */}
                        <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                          {isEditing ? (
                            <EditableCell
                              type="number"
                              value={editValues.advance_amount}
                              onChange={(v) =>
                                handleEditChange("advance_amount", v)
                              }
                              placeholder="0"
                            />
                          ) : (
                            <>
                              {formatCurrency(salary.advance_amount)}
                              <span className="ml-1 text-[10px] font-normal text-gray-400">
                                TSH
                              </span>
                            </>
                          )}
                        </td>

                        {/* Advance Paid At */}
                        <td className="px-5 py-4 align-middle text-xs text-gray-500">
                          {salary.advance_paid_at ? (
                            formatDate(salary.advance_paid_at)
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Full Payment */}
                        <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                          {isEditing ? (
                            <EditableCell
                              type="number"
                              value={editValues.full_payment_amount}
                              onChange={(v) =>
                                handleEditChange("full_payment_amount", v)
                              }
                              placeholder="0"
                            />
                          ) : (
                            <>
                              {formatCurrency(salary.full_payment_amount)}
                              <span className="ml-1 text-[10px] font-normal text-gray-400">
                                TSH
                              </span>
                            </>
                          )}
                        </td>

                        {/* Full Paid At */}
                        <td className="px-5 py-4 align-middle text-xs text-gray-500">
                          {salary.full_payment_paid_at ? (
                            formatDate(salary.full_payment_paid_at)
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Balance — always computed, never editable */}
                        <td className="px-5 py-4 align-middle font-bold whitespace-nowrap tabular-nums">
                          <span
                            className={
                              parseFloat(salary.balance) > 0
                                ? "text-red"
                                : "text-green"
                            }
                          >
                            {formatCurrency(salary.balance)}
                          </span>
                          <span className="ml-1 text-[10px] font-normal text-gray-400">
                            TSH
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 align-middle">
                          <StatusBadge status={salary.status} />
                        </td>

                        {/* Notes */}
                        <td className="max-w-40 px-5 py-4 align-middle text-xs text-gray-400">
                          {isEditing ? (
                            <EditableCell
                              value={editValues.notes}
                              onChange={(v) => handleEditChange("notes", v)}
                              placeholder="Notes..."
                            />
                          ) : (
                            <span className="block truncate">
                              {salary.notes || "—"}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 align-middle">
                          {user?.data?.role === "admin" && (
                            <div className="flex items-center gap-2">
                              {isEditing ? (
                                // ── Save / Cancel ──────────────────────────
                                <>
                                  <button
                                    onClick={() => saveEdit(salary.id)}
                                    disabled={savingId === salary.id}
                                    className="text-green flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-green-100 transition-colors hover:bg-green-200 disabled:opacity-60"
                                    title="Save changes"
                                  >
                                    {savingId === salary.id ? (
                                      <span className="border-green h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                                    ) : (
                                      <Check size={14} />
                                    )}
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                                    title="Cancel"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : isConfirmingDelete ? (
                                // ── Delete confirmation ────────────────────
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-semibold whitespace-nowrap text-gray-500">
                                    Sure?
                                  </span>
                                  <button
                                    onClick={() => handleDelete(salary.id)}
                                    disabled={deletingId === salary.id}
                                    className="text-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-100 transition-colors hover:bg-red-200 disabled:opacity-60"
                                    title="Confirm delete"
                                  >
                                    {deletingId === salary.id ? (
                                      <span className="border-red h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                                    ) : (
                                      <Check size={14} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                                    title="Cancel"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                // ── Normal actions ─────────────────────────
                                <>
                                  <ActionDropdown
                                    employee={{
                                      status: isPaid ? "inactive" : "active",
                                    }}
                                    isOpen={openDropdown === salary.id}
                                    onToggle={() => handleToggle(salary.id)}
                                    onClose={() => setOpenDropdown(null)}
                                    onSelectAction={(type) =>
                                      setModal({
                                        employee: {
                                          id: salary.employee_id,
                                          name: salary.employee_name,
                                          basic_salary: salary.basic_salary,
                                          account_number: salary.account_number,
                                        },
                                        type,
                                      })
                                    }
                                  />

                                  {/* Edit — hidden for paid records */}
                                  {!isPaid && (
                                    <button
                                      onClick={() => startEdit(salary)}
                                      className="bg-green/10 hover:bg-green/20 text-green flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                                      title="Edit record"
                                    >
                                      <Pencil size={14} />
                                    </button>
                                  )}

                                  {/* Delete — hidden for paid records */}
                                  {!isPaid && (
                                    <button
                                      onClick={() => {
                                        setConfirmDeleteId(salary.id);
                                        setEditingId(null);
                                      }}
                                      className="text-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 transition-colors hover:bg-red-100"
                                      title="Delete record"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && salaries.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
