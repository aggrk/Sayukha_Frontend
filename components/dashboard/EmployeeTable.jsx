"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { chartColors, theme } from "../../lib/data";
import useFetch from "../../hooks/useFetch";
import api from "../../lib/api";
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

// ─── Update User Modal ─────────────────────────────────────────────────────────

function UpdateUserModal({ employee, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: employee.name ?? "",
      email: employee.email ?? "",
      status: employee.status ?? "active",
      position: employee.position ?? "",
      account_number: employee.account_number ?? "",
      role: employee.role ?? "",
      basic_salary: employee.basic_salary ?? "",
    },
  });

  const watchedStatus = watch("status");

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const res = await api.patch(`/users/${employee.id}`, data);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setServerError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between border-b"
          style={{
            borderColor: "#f3f4f6",
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${chartColors[0]} 0%, ${chartColors[1]}cc 100%)`,
              }}
            >
              {getInitials(employee.name)}
            </div>
            <div>
              <p
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Update Employee
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{employee.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
            {/* ── Personal Info ───────────────────────────────────────── */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <span
                  className="w-4 h-px inline-block"
                  style={{ backgroundColor: theme.graySoft }}
                />
                Personal Info
                <span
                  className="flex-1 h-px inline-block"
                  style={{ backgroundColor: theme.graySoft }}
                />
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <User size={12} /> Full Name{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={14} />
                    </span>
                    <input
                      {...register("name", { required: "Name is required" })}
                      placeholder="e.g. John Doe"
                      className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                      style={{
                        borderColor: errors.name ? "#fca5a5" : "#e5e7eb",
                        backgroundColor: errors.name ? "#fff7f7" : "#fff",
                        fontFamily: "'Inter', sans-serif",
                        color: theme.dark,
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-red-400 font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Mail size={12} /> Email Address{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={14} />
                    </span>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      placeholder="e.g. john@company.com"
                      className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                      style={{
                        borderColor: errors.email ? "#fca5a5" : "#e5e7eb",
                        backgroundColor: errors.email ? "#fff7f7" : "#fff",
                        fontFamily: "'Inter', sans-serif",
                        color: theme.dark,
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-400 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Job Info ────────────────────────────────────────────── */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <span
                  className="w-4 h-px inline-block"
                  style={{ backgroundColor: theme.graySoft }}
                />
                Job Info
                <span
                  className="flex-1 h-px inline-block"
                  style={{ backgroundColor: theme.graySoft }}
                />
              </p>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Position */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Briefcase size={12} /> Position{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Briefcase size={14} />
                      </span>
                      <input
                        {...register("position", {
                          required: "Position is required",
                        })}
                        placeholder="e.g. Site Manager"
                        className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                        style={{
                          borderColor: errors.position ? "#fca5a5" : "#e5e7eb",
                          backgroundColor: errors.position ? "#fff7f7" : "#fff",
                          fontFamily: "'Inter', sans-serif",
                          color: theme.dark,
                        }}
                      />
                    </div>
                    {errors.position && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {errors.position.message}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <ToggleLeft size={12} /> Status{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <ToggleLeft size={14} />
                      </span>
                      <select
                        {...register("status", {
                          required: "Status is required",
                        })}
                        className="w-full text-sm py-2.5 pl-10 pr-9 rounded-xl border outline-none appearance-none"
                        style={{
                          borderColor: errors.status ? "#fca5a5" : "#e5e7eb",
                          backgroundColor: errors.status ? "#fff7f7" : "#fff",
                          fontFamily: "'Inter', sans-serif",
                          color: theme.dark,
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={14} />
                      </span>
                    </div>
                    {errors.status && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Account Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <CreditCard size={12} /> Account Number{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <CreditCard size={14} />
                      </span>
                      <input
                        {...register("account_number", {
                          required: "Account number is required",
                        })}
                        placeholder="e.g. 1234567890"
                        className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                        style={{
                          borderColor: errors.account_number
                            ? "#fca5a5"
                            : "#e5e7eb",
                          backgroundColor: errors.account_number
                            ? "#fff7f7"
                            : "#fff",
                          fontFamily: "'Inter', sans-serif",
                          color: theme.dark,
                        }}
                      />
                    </div>
                    {errors.account_number && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {errors.account_number.message}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <ShieldCheck size={12} /> Role{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <ShieldCheck size={14} />
                      </span>
                      <select
                        {...register("role", { required: "Role is required" })}
                        className="w-full text-sm py-2.5 pl-10 pr-9 rounded-xl border outline-none appearance-none"
                        style={{
                          borderColor: errors.role ? "#fca5a5" : "#e5e7eb",
                          backgroundColor: errors.role ? "#fff7f7" : "#fff",
                          fontFamily: "'Inter', sans-serif",
                          color: theme.dark,
                        }}
                      >
                        <option value="">Select role...</option>
                        <option value="admin">Admin</option>
                        <option value="site_manager">Site Manager</option>
                        <option value="site_admin">Site Admin</option>
                        <option value="user">User</option>
                      </select>
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={14} />
                      </span>
                    </div>
                    {errors.role && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  {/* Basic Salary */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <DollarSign size={12} /> Basic Salary{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("basic_salary", {
                          required: "Basic salary is required",
                          min: {
                            value: 1,
                            message: "Salary must be greater than 0",
                          },
                        })}
                        type="number"
                        placeholder="0.00"
                        className="w-full text-sm py-2.5 pl-4 pr-14 rounded-xl border outline-none"
                        style={{
                          borderColor: errors.basic_salary
                            ? "#fca5a5"
                            : "#e5e7eb",
                          backgroundColor: errors.basic_salary
                            ? "#fff7f7"
                            : "#fff",
                          fontFamily: "'Inter', sans-serif",
                          color: theme.dark,
                        }}
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400">
                        TSH
                      </span>
                    </div>
                    {errors.basic_salary && (
                      <p className="text-[11px] text-red-400 font-medium">
                        {errors.basic_salary.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Status Preview ──────────────────────────────────────── */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor:
                  watchedStatus === "active" ? "#f0fdf4" : "#fff7f7",
                borderColor: watchedStatus === "active" ? "#bbf7d0" : "#fecaca",
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-colors duration-300"
                style={{
                  backgroundColor:
                    watchedStatus === "active"
                      ? statusConfig.active.dot
                      : statusConfig.inactive.dot,
                }}
              />
              <p
                className="text-xs font-semibold transition-colors duration-300"
                style={{
                  color:
                    watchedStatus === "active"
                      ? statusConfig.active.color
                      : statusConfig.inactive.color,
                }}
              >
                This employee will be marked as{" "}
                <span className="font-bold capitalize">{watchedStatus}</span>
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">
                  {serverError}
                </p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <p className="text-xs font-medium text-green-700">
                  Employee updated successfully!
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px mx-6" style={{ backgroundColor: "#f3f4f6" }} />

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
                boxShadow: `0 4px 14px ${theme.green}35`,
              }}
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Edit2 size={15} />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ employee, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/users/${employee.id}`);
      onSuccess?.();
      onClose();
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
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center gap-3">
          {/* Warning Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
            style={{ backgroundColor: "#fee2e2" }}
          >
            <AlertTriangle size={26} style={{ color: "#dc2626" }} />
          </div>

          <div>
            <p
              className="text-base font-bold text-gray-800"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Delete Employee
            </p>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {employee.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          {/* Employee Card */}
          <div
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border mt-1"
            style={{ backgroundColor: "#fff7f7", borderColor: "#fecaca" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, ${chartColors[0]} 0%, ${chartColors[1]}cc 100%)`,
              }}
            >
              {getInitials(employee.name)}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700">
                {employee.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {employee.position ?? employee.email}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mx-6 mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ backgroundColor: "#fee2e2" }}
          >
            <X size={13} className="text-red-500 shrink-0" />
            <p className="text-xs font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
            style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
              boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
            }}
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add User Modal ────────────────────────────────────────────────────────────

function AddUserModal({ onClose, onSuccess }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      account_number: "",
      basic_salary: "",
    },
  });

  const [serverError, setServerError] = useState("");

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => api.post("/users/signup", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    },
    onError: (err) => {
      setServerError(err?.response?.data?.message ?? "Something went wrong.");
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between border-b"
          style={{
            borderColor: "#f3f4f6",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: "#bfdbfe" }}
            >
              <User size={18} style={{ color: "#1d4ed8" }} />
            </div>
            <div>
              <p
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Add New Employee
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Fill in the details below to register
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* ── Personal Info ──────────────────────────────────────── */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <span
                className="w-4 h-px inline-block"
                style={{ backgroundColor: theme.graySoft }}
              />
              Personal Info
              <span
                className="flex-1 h-px inline-block"
                style={{ backgroundColor: theme.graySoft }}
              />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <User size={12} /> Full Name{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={14} />
                  </span>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. John Doe"
                    className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                    style={{
                      borderColor: errors.name ? "#fca5a5" : "#e5e7eb",
                      backgroundColor: errors.name ? "#fff7f7" : "#fff",
                      fontFamily: "'Inter', sans-serif",
                      color: theme.dark,
                    }}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <Mail size={12} /> Email Address{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={14} />
                  </span>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="e.g. john@company.com"
                    className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                    style={{
                      borderColor: errors.email ? "#fca5a5" : "#e5e7eb",
                      backgroundColor: errors.email ? "#fff7f7" : "#fff",
                      fontFamily: "'Inter', sans-serif",
                      color: theme.dark,
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Phone size={12} /> Phone Number{" "}
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={14} />
                </span>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  type="tel"
                  placeholder="e.g. +255 712 345 678"
                  className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                  style={{
                    borderColor: errors.phone ? "#fca5a5" : "#e5e7eb",
                    backgroundColor: errors.phone ? "#fff7f7" : "#fff",
                    fontFamily: "'Inter', sans-serif",
                    color: theme.dark,
                  }}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-400 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* ── Job Info ───────────────────────────────────────────── */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <span
                className="w-4 h-px inline-block"
                style={{ backgroundColor: theme.graySoft }}
              />
              Job Info
              <span
                className="flex-1 h-px inline-block"
                style={{ backgroundColor: theme.graySoft }}
              />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Position */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <Briefcase size={12} /> Position{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Briefcase size={14} />
                  </span>
                  <input
                    {...register("position", {
                      required: "Position is required",
                    })}
                    placeholder="e.g. Site Manager"
                    className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                    style={{
                      borderColor: errors.position ? "#fca5a5" : "#e5e7eb",
                      backgroundColor: errors.position ? "#fff7f7" : "#fff",
                      fontFamily: "'Inter', sans-serif",
                      color: theme.dark,
                    }}
                  />
                </div>
                {errors.position && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {errors.position.message}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <CreditCard size={12} /> Account Number{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <CreditCard size={14} />
                  </span>
                  <input
                    {...register("account_number", {
                      required: "Account number is required",
                    })}
                    placeholder="e.g. 1234567890"
                    className="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border outline-none"
                    style={{
                      borderColor: errors.account_number
                        ? "#fca5a5"
                        : "#e5e7eb",
                      backgroundColor: errors.account_number
                        ? "#fff7f7"
                        : "#fff",
                      fontFamily: "'Inter', sans-serif",
                      color: theme.dark,
                    }}
                  />
                </div>
                {errors.account_number && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {errors.account_number.message}
                  </p>
                )}
              </div>
            </div>

            {/* Basic Salary */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <DollarSign size={12} /> Basic Salary{" "}
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("basic_salary", {
                    required: "Basic salary is required",
                    min: { value: 1, message: "Salary must be greater than 0" },
                  })}
                  type="number"
                  placeholder="0.00"
                  className="w-full text-sm py-2.5 pl-4 pr-14 rounded-xl border outline-none"
                  style={{
                    borderColor: errors.basic_salary ? "#fca5a5" : "#e5e7eb",
                    backgroundColor: errors.basic_salary ? "#fff7f7" : "#fff",
                    fontFamily: "'Inter', sans-serif",
                    color: theme.dark,
                  }}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400">
                  TSH
                </span>
              </div>
              {errors.basic_salary && (
                <p className="text-[11px] text-red-400 font-medium">
                  {errors.basic_salary.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">
                  {serverError}
                </p>
              </div>
            )}

            {/* Success */}
            {isSuccess && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <p className="text-xs font-medium text-green-700">
                  Employee registered successfully!
                </p>
              </div>
            )}
          </div>

          <div className="h-px mx-6" style={{ backgroundColor: "#f3f4f6" }} />

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isSuccess}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              {isPending ? "Registering..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Salary Modal ──────────────────────────────────────────────────────────────
function SalaryModal({ employee, type, onClose }) {
  const [form, setForm] = useState({
    month: getCurrentMonth(),
    amount: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isAdvance = type === "advance";
  const endpoint = isAdvance
    ? "/salary-payment/advance"
    : "/salary-payment/full";
  const amountKey = isAdvance ? "advance_amount" : "full_payment_amount";

  const handleSubmit = async () => {
    if (!form.amount || !form.month) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post(endpoint, {
        employee_id: employee.id,
        month: form.month,
        [amountKey]: form.amount,
        notes: form.notes,
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

        <div
          className="px-6 py-3 flex items-center gap-4 border-b"
          style={{ backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Basic Salary
            </span>
            <span className="text-sm font-bold text-gray-700">
              {Number(employee.basic_salary).toLocaleString()} TSH / mo
            </span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Account
            </span>
            <span className="text-sm font-bold text-gray-700">
              {employee.account_number ?? "—"}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Month <span className="text-red-400">*</span>
            </label>
            <input
              type="month"
              value={form.month}
              onChange={(e) =>
                setForm((p) => ({ ...p, month: e.target.value }))
              }
              className="text-sm px-4 py-2.5 rounded-xl border outline-none"
              style={{
                borderColor: "#e5e7eb",
                fontFamily: "'Inter', sans-serif",
                color: theme.dark,
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              {isAdvance ? "Advance Amount" : "Full Payment Amount"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.amount}
                placeholder="0.00"
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                className="w-full text-sm px-4 py-2.5 rounded-xl border outline-none pr-16"
                style={{
                  borderColor: "#e5e7eb",
                  fontFamily: "'Inter', sans-serif",
                  color: theme.dark,
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                TSH
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Notes
            </label>
            <textarea
              value={form.notes}
              placeholder="Optional notes..."
              rows={3}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              className="text-sm px-4 py-2.5 rounded-xl border outline-none resize-none"
              style={{
                borderColor: "#e5e7eb",
                fontFamily: "'Inter', sans-serif",
                color: theme.dark,
              }}
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: "#fee2e2" }}
            >
              <X size={13} className="text-red-500 shrink-0" />
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}
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

        <div className="px-6 pb-5 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
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
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
            style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
          >
            Cancel
          </button>
        </div>
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

// ─── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, totalCount, limit, onChange }) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
    )
    .reduce((acc, page, idx, arr) => {
      if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
      acc.push(page);
      return acc;
    }, []);

  return (
    <div
      className="px-7 py-4 flex items-center justify-between border-t"
      style={{ borderColor: theme.graySoft }}
    >
      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">
          {totalCount === 0 ? 0 : start}–{end}
        </span>{" "}
        of <span className="font-semibold text-gray-600">{totalCount}</span>{" "}
        employees
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:bg-gray-100"
          style={{ color: "#9ca3af" }}
        >
          <ChevronDown size={14} style={{ transform: "rotate(90deg)" }} />
        </button>

        {pages.map((item, idx) =>
          item === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor:
                  currentPage === item ? theme.green : "transparent",
                color: currentPage === item ? "#fff" : "#9ca3af",
                boxShadow:
                  currentPage === item ? `0 2px 8px ${theme.green}40` : "none",
              }}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:bg-gray-100"
          style={{ color: "#9ca3af" }}
        >
          <ChevronDown size={14} style={{ transform: "rotate(-90deg)" }} />
        </button>
      </div>
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
        <DeleteModal
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
        />
      </section>
    </>
  );
}
