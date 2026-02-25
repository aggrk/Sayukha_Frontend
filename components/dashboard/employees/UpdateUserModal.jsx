"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Briefcase,
  ChevronDown,
  CreditCard,
  DollarSign,
  Edit2,
  Loader2,
  Mail,
  ShieldCheck,
  ToggleLeft,
  User,
  X,
} from "lucide-react";
import { getInitials } from "../../../lib/utils";
import api from "../../../lib/api";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateUserModal({ employee, onClose, onSuccess }) {
  const queryClient = useQueryClient();
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
      await api.patch(`/users/${employee.id}`, data);
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setServerError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed h-full inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full bg-white border border-[#e5e7eb] max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-linear-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm bg-linear-to-br from-green to-chart-300">
              {getInitials(employee.name)}
            </div>
            <div>
              <p className="text-sm font-bold font-heading text-gray-800">
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
                <span className="w-4 h-px inline-block bg-gray-low-soft" />
                Personal Info
                <span className="flex-1 h-px inline-block bg-gray-low-soft" />
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
                      className={`w-full border font-heading text-dark text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none ${
                        errors.name
                          ? "border-[#fca5a5] bg-[#fff7f7]"
                          : "border-[#e5e7eb] bg-white"
                      }`}
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
                      className={`w-full border font-heading text-dark text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none ${
                        errors.email
                          ? "border-[#fca5a5] bg-[#fff7f7]"
                          : "border-[#e5e7eb] bg-white"
                      }`}
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
                <span className="w-4 h-px inline-block bg-gray-low-soft" />
                Job Info
                <span className="flex-1 h-px inline-block bg-gray-low-soft" />
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
                        className={`w-full border font-heading text-dark text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none ${
                          errors.position
                            ? "border-[#fca5a5] bg-[#fff7f7]"
                            : "border-[#e5e7eb] bg-white"
                        }`}
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
                        className={`w-full border font-heading text-dark text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none appearance-none ${
                          errors.status
                            ? "border-[#fca5a5] bg-[#fff7f7]"
                            : "border-[#e5e7eb] bg-white"
                        }`}
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
                        className={`w-full border font-heading text-dark text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none ${
                          errors.account_number
                            ? "border-[#fca5a5] bg-[#fff7f7]"
                            : "border-[#e5e7eb] bg-white"
                        }`}
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
                        className={`w-full border font-heading text-dark text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none appearance-none ${
                          errors.role
                            ? "border-[#fca5a5] bg-[#fff7f7]"
                            : "border-[#e5e7eb] bg-white"
                        }`}
                      >
                        <option value="">Select role...</option>
                        <option value="admin">Admin</option>
                        <option value="site manager">Site Manager</option>
                        <option value="site admin">Site Admin</option>
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
                        className={`w-full border font-heading text-dark text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none ${
                          errors.basic_salary
                            ? "border-[#fca5a5] bg-[#fff7f7]"
                            : "border-[#e5e7eb] bg-white"
                        }`}
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
              className={`flex ${
                watchedStatus === "active"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${watchedStatus === "active" ? "bg-active-dot" : "bg-inactive-dot"}`}
              />
              <p
                className={`text-xs font-semibold transition-colors duration-300 ${watchedStatus === "active" ? "text-active" : "text-inactive"}`}
              >
                This employee will be marked as{" "}
                <span className="font-bold capitalize">{watchedStatus}</span>
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fee2e2]">
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">
                  {serverError}
                </p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#dcfce7]">
                <p className="text-xs font-medium text-green-700">
                  Employee updated successfully!
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px mx-6 bg-[#f3f4f6]" />

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50 text-[#6b7280] border-[#e5e7eb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-sm bg-linear-to-br from-green to-green-light"
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
