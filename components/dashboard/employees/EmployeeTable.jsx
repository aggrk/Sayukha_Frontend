"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { chartColors, theme } from "../../../lib/data";
import useFetch from "../../../hooks/useFetch";
import Pagination from "../../ui/Pagination";
import api from "../../../lib/api";
import {
  Edit2,
  Trash2,
  ChevronDown,
  Plus,
  Wallet,
  Banknote,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  CreditCard,
  AlertTriangle,
  DollarSign,
  ToggleLeft,
  ShieldCheck,
} from "lucide-react";
import UpdateUserModal from "./UpdateUserModal";
import DeleteUserModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";

// ─── Status Config ─────────────────────────────────────────────────────────────
const statusConfig = {
  active: { bg: "#dcfce7", color: "#15803d", dot: "#16a34a", label: "Active" },
  inactive: {
    bg: "#fee2e2",
    color: "#b91c1c",
    dot: "#dc2626",
    label: "Inactive",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

// ─── Input Field Component ─────────────────────────────────────────────────────
function InputField({ label, icon, required, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          {...props}
          className="w-full text-sm py-2.5 rounded-xl border outline-none transition-all"
          style={{
            paddingLeft: icon ? "2.5rem" : "1rem",
            paddingRight: "1rem",
            borderColor: error ? "#fca5a5" : "#e5e7eb",
            backgroundColor: error ? "#fff7f7" : "#fff",
            fontFamily: "'Inter', sans-serif",
            color: theme.dark,
          }}
        />
      </div>
      {error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}
    </div>
  );
}

// ─── Select Field Component ────────────────────────────────────────────────────
function SelectField({ label, icon, required, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <select
          {...props}
          className="w-full text-sm py-2.5 rounded-xl border outline-none transition-all appearance-none"
          style={{
            paddingLeft: icon ? "2.5rem" : "1rem",
            paddingRight: "2.5rem",
            borderColor: error ? "#fca5a5" : "#e5e7eb",
            backgroundColor: error ? "#fff7f7" : "#fff",
            fontFamily: "'Inter', sans-serif",
            color: theme.dark,
          }}
        >
          {children}
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={14} />
        </span>
      </div>
      {error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}
    </div>
  );
}

// ─── Salary Modal ──────────────────────────────────────────────────────────────

function SalaryModal({ employee, type, onClose }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      month: getCurrentMonth(),
      amount: "",
      notes: "",
    },
  });

  const watchedMonth = watch("month");

  const params = {
    employee_id: employee.id,
    payment_month: watchedMonth,
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: employeeSalaryData } = useFetch(
    "salary-payments",
    "/salary-payments",
    params,
  );
  const salaryData = employeeSalaryData?.data?.[0] ?? null;

  const isAdvance = type === "advance";
  const endpoint = isAdvance
    ? "/salary-payments/advance"
    : "/salary-payments/full";
  const amountKey = isAdvance ? "advance_amount" : "full_payment_amount";

  const isSalaryPaid =
    salaryData &&
    Math.ceil(salaryData.balance) === 0 &&
    salaryData.status === "paid";

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await api.post(endpoint, {
        employee_id: employee.id,
        month: data.month,
        [amountKey]: data.amount,
        notes: data.notes,
      });
      await queryClient.invalidateQueries({
        queryKey: ["salary-payments", employee.id, watchedMonth],
      });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between border-b"
          style={{
            borderColor: "#f3f4f6",
            background: isAdvance
              ? "linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)"
              : "linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: isAdvance ? "#fef08a" : "#bbf7d0" }}
            >
              {isAdvance ? (
                <Wallet size={18} style={{ color: "#a16207" }} />
              ) : (
                <Banknote size={18} style={{ color: "#15803d" }} />
              )}
            </div>
            <div>
              <p
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isAdvance ? "Advance Salary" : "Full Salary Payment"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{employee.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Salary Info Bar */}
        <div
          className="px-6 py-3 border-b flex flex-wrap items-center gap-x-6 gap-y-2"
          style={{ backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Basic Salary
            </span>
            <span className="text-sm font-bold text-gray-700">
              {Number(employee.basic_salary).toLocaleString()} TSH / mo
            </span>
          </div>

          <span className="w-px h-8 bg-gray-200 hidden sm:block" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Status
            </span>
            {!salaryData ? (
              <span className="text-sm font-semibold text-blue-500">
                No payment record yet
              </span>
            ) : isSalaryPaid ? (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Fully paid
              </span>
            ) : (
              <span className="text-sm font-semibold text-orange-500">
                Balance: {Number(salaryData.balance).toLocaleString()} TSH
              </span>
            )}
          </div>

          <span className="w-px h-8 bg-gray-200 hidden sm:block" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Account
            </span>
            <span className="text-sm font-bold text-gray-700">
              {employee.account_number ?? "—"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Month */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Month <span className="text-red-400">*</span>
              </label>
              <input
                type="month"
                {...register("month", { required: "Month is required." })}
                className="text-sm px-4 py-2.5 rounded-xl border outline-none"
                style={{
                  borderColor: errors.month ? "#f87171" : "#e5e7eb",
                  fontFamily: "'Inter', sans-serif",
                  color: theme.dark,
                }}
              />
              {errors.month && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.month.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {isAdvance ? "Advance Amount" : "Full Payment Amount"}{" "}
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  {...register("amount", {
                    required: "Amount is required.",
                    min: {
                      value: 1,
                      message: "Amount must be greater than 0.",
                    },
                  })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border outline-none pr-16"
                  style={{
                    borderColor: errors.amount ? "#f87171" : "#e5e7eb",
                    fontFamily: "'Inter', sans-serif",
                    color: theme.dark,
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  TSH
                </span>
              </div>
              {errors.amount && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Notes
              </label>
              <textarea
                placeholder="Optional notes..."
                rows={3}
                {...register("notes")}
                className="text-sm px-4 py-2.5 rounded-xl border outline-none resize-none"
                style={{
                  borderColor: "#e5e7eb",
                  fontFamily: "'Inter', sans-serif",
                  color: theme.dark,
                }}
              />
            </div>

            {/* API Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <p className="text-xs font-medium text-green-700">
                  Payment recorded successfully!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSalaryPaid || loading || success}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{
                background: isAdvance
                  ? "linear-gradient(135deg, #ca8a04 0%, #eab308 100%)"
                  : `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
                boxShadow: isAdvance
                  ? "0 4px 14px rgba(202,138,4,0.3)"
                  : `0 4px 14px ${theme.green}35`,
              }}
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isAdvance ? (
                <Wallet size={15} />
              ) : (
                <Banknote size={15} />
              )}
              {loading
                ? "Processing..."
                : isAdvance
                  ? "Pay Advance"
                  : "Pay Full Salary"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Action Dropdown ───────────────────────────────────────────────────────────
function ActionDropdown({
  employee,
  isOpen,
  onToggle,
  onClose,
  onSelectAction,
}) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) return;
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  const actions = [
    {
      label: "Pay Advance Salary",
      desc: "Partial early payment",
      icon: <Wallet size={14} />,
      type: "advance",
    },
    {
      label: "Pay Full Salary",
      desc: "Complete month payment",
      icon: <Banknote size={14} />,
      type: "full",
    },
  ];

  if (employee.status !== "active") return;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:bg-gray-50 active:scale-95"
        style={{ borderColor: theme.graySoft, color: "#6b7280" }}
      >
        More
        <ChevronDown
          size={13}
          className="transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] w-56 rounded-2xl shadow-xl border z-20 overflow-hidden bg-white"
          style={{ borderColor: "#e5e7eb" }}
        >
          <p
            className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b"
            style={{ borderColor: "#f3f4f6" }}
          >
            Salary Actions
          </p>
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                onSelectAction(action.type);
                onClose();
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors group"
            >
              <span
                className="mt-0.5 group-hover:scale-110 transition-transform"
                style={{ color: theme.green }}
              >
                {action.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {action.label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {action.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const LIMIT = 10;

export default function EmployeeTable() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [updateEmployee, setUpdateEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: employeesData,
    isLoading,
    refetch,
  } = useFetch(["employees", currentPage], "/users", {
    page: currentPage,
    limit: LIMIT,
  });

  const employees = employeesData?.data ?? [];
  const totalCount = employeesData?.results ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);
  console.log(totalPages);

  const filtered =
    filterStatus === "All"
      ? employees
      : employees.filter(
          (e) => e.status?.toLowerCase() === filterStatus.toLowerCase(),
        );

  const activeCount = employees.filter(
    (e) => e.status?.toLowerCase() === "active",
  ).length;

  const handleToggle = useCallback((id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  return (
    <>
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSuccess={() => {
            refetch();
            setCurrentPage(1);
          }}
        />
      )}

      {updateEmployee && (
        <UpdateUserModal
          employee={updateEmployee}
          onClose={() => setUpdateEmployee(null)}
          onSuccess={() => {
            refetch();
            setUpdateEmployee(null);
          }}
        />
      )}

      {deleteEmployee && (
        <DeleteUserModal
          employee={deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          onSuccess={() => {
            refetch();
            setDeleteEmployee(null);
            if (filtered.length === 1 && currentPage > 1) {
              setCurrentPage((p) => p - 1);
            }
          }}
        />
      )}

      {modal && (
        <SalaryModal
          employee={modal.employee}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}

      <section
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: theme.whiteSoft,
          borderColor: theme.graySoft,
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <div
          className="px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b"
          style={{ borderColor: theme.graySoft }}
        >
          <div>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Employee Records
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-gray-400">{totalCount} total</p>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span
                className="text-sm font-medium"
                style={{ color: theme.green }}
              >
                {activeCount} active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 p-1 rounded-xl border text-xs"
              style={{
                borderColor: theme.graySoft,
                backgroundColor: theme.grayLight,
              }}
            >
              {["All", "Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="px-3 py-1.5 rounded-lg font-semibold transition-all duration-150"
                  style={{
                    backgroundColor:
                      filterStatus === s ? "#fff" : "transparent",
                    color: filterStatus === s ? theme.green : "#9ca3af",
                    boxShadow:
                      filterStatus === s
                        ? "0 1px 3px rgba(0,0,0,0.08)"
                        : "none",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
                boxShadow: `0 4px 14px ${theme.green}35`,
              }}
            >
              <Plus size={15} />
              Add New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading employees...</span>
            </div>
          ) : (
            <table className="w-full min-w-175">
              <thead>
                <tr style={{ backgroundColor: theme.grayLight }}>
                  {[
                    "Employee",
                    "Account No.",
                    "Position",
                    "Basic Salary / mo",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "#9ca3af" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((emp, idx) => {
                  const sKey = emp.status?.toLowerCase();
                  const sConfig = statusConfig[sKey] ?? statusConfig.inactive;

                  return (
                    <tr
                      key={emp.id}
                      className="border-t transition-colors hover:bg-gray-50/70 group"
                      style={{ borderColor: theme.graySoft }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${chartColors[idx % chartColors.length]} 0%, ${chartColors[(idx + 1) % chartColors.length]}cc 100%)`,
                            }}
                          >
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {emp.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg"
                          style={{
                            backgroundColor: theme.grayLight,
                            color: "#6b7280",
                          }}
                        >
                          {emp.account_number ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-medium px-2.5 py-1.5 rounded-lg"
                          style={{
                            backgroundColor: theme.grayLight,
                            color: "#6b7280",
                          }}
                        >
                          {emp.position ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-800">
                          {Number(emp.basic_salary).toLocaleString()} TSH
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: sConfig.dot }}
                          />
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: sConfig.bg,
                              color: sConfig.color,
                            }}
                          >
                            {sConfig.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setUpdateEmployee(emp)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
                              boxShadow: `0 2px 8px ${theme.green}30`,
                            }}
                          >
                            <Edit2 size={12} />
                            Update
                          </button>

                          <button
                            onClick={() => setDeleteEmployee(emp)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${theme.red} 0%, ${theme.redDark} 100%)`,
                              boxShadow: `0 2px 8px ${theme.red}30`,
                            }}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>

                          <ActionDropdown
                            employee={emp}
                            isOpen={openDropdown === emp.id}
                            onToggle={() => handleToggle(emp.id)}
                            onClose={() => setOpenDropdown(null)}
                            onSelectAction={(type) =>
                              setModal({ employee: emp, type })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: theme.grayLight }}
              >
                <User size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-600">
                No employees found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try changing the filter or add a new employee
              </p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={LIMIT}
          onChange={setCurrentPage}
          tableName="employees"
        />
      </section>
    </>
  );
}
