"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  CreditCard,
  DollarSign,
  Loader2,
  Mail,
  Phone,
  Plus,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import api from "../../../lib/api";

export default function AddUserModal({ onClose, onSuccess }) {
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
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
    <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3f4f6] bg-linear-to-br from-[#eff6ff] to-[#dbeafe] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-green text-gray-light flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
              <User size={18} />
            </div>
            <div>
              <p
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Add New Employee
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Fill in the details below to register
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-black/5"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className="flex flex-col gap-4 px-6 py-5">
            {/* ── Personal Info ──────────────────────────────────────── */}
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              <span className="bg-gray-low-soft inline-block h-px w-4" />
              Personal Info
              <span className="bg-gray-low-soft inline-block h-px flex-1" />
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  <User size={12} /> Full Name{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                    <User size={14} />
                  </span>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. John Doe"
                    className={`text-dark font-body w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none ${
                      errors.name
                        ? "border-[#fca5a5] bg-[#fff7f7]"
                        : "border-[#e5e7eb] bg-white"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] font-medium text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  <Mail size={12} /> Email Address{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
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
                    className={`text-dark font-body w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none ${
                      errors.email
                        ? "border-[#fca5a5] bg-[#fff7f7]"
                        : "border-[#e5e7eb] bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-medium text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                <Phone size={12} /> Phone Number{" "}
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                  <Phone size={14} />
                </span>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  type="tel"
                  placeholder="e.g. +255 712 345 678"
                  className={`text-dark font-body w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none ${
                    errors.phone
                      ? "border-[#fca5a5] bg-[#fff7f7]"
                      : "border-[#e5e7eb] bg-white"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-medium text-red-400">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* ── Job Info ───────────────────────────────────────────── */}
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              <span className="bg-gray-low-soft inline-block h-px w-4" />
              Job Info
              <span className="bg-gray-low-soft inline-block h-px flex-1" />
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Position */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  <Briefcase size={12} /> Position{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                    <Briefcase size={14} />
                  </span>
                  <input
                    {...register("position", {
                      required: "Position is required",
                    })}
                    placeholder="e.g. Site Manager"
                    className={`text-dark font-body w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none ${
                      errors.position
                        ? "border-[#fca5a5] bg-[#fff7f7]"
                        : "border-[#e5e7eb] bg-white"
                    }`}
                  />
                </div>
                {errors.position && (
                  <p className="text-[11px] font-medium text-red-400">
                    {errors.position.message}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  <CreditCard size={12} /> Account Number{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                    <CreditCard size={14} />
                  </span>
                  <input
                    {...register("account_number", {
                      required: "Account number is required",
                    })}
                    placeholder="e.g. 1234567890"
                    className={`text-dark font-body w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none ${
                      errors.account_number
                        ? "border-[#fca5a5] bg-[#fff7f7]"
                        : "border-[#e5e7eb] bg-white"
                    }`}
                  />
                </div>
                {errors.account_number && (
                  <p className="text-[11px] font-medium text-red-400">
                    {errors.account_number.message}
                  </p>
                )}
              </div>
            </div>

            {/* Basic Salary */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
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
                  className={`text-dark font-body w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm outline-none ${
                    errors.basic_salary
                      ? "border-[#fca5a5] bg-[#fff7f7]"
                      : "border-[#e5e7eb] bg-white"
                  }`}
                />
                <span className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[11px] font-bold text-gray-400">
                  TSH
                </span>
              </div>
              {errors.basic_salary && (
                <p className="text-[11px] font-medium text-red-400">
                  {errors.basic_salary.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="flex items-center gap-2 rounded-xl bg-[#fee2e2] px-4 py-2.5">
                <X size={13} className="shrink-0 text-red-500" />
                <p className="text-xs font-medium text-red-600">
                  {serverError}
                </p>
              </div>
            )}

            {/* Success */}
            {isSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-[#dcfce7] px-4 py-2.5">
                <p className="text-xs font-medium text-green-700">
                  Employee registered successfully!
                </p>
              </div>
            )}
          </div>

          <div className="mx-6 h-px bg-[#f3f4f6]" />

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isSuccess}
              className="bg-green flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
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
