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
    <div className="fixed inset-0 h-full  z-50 flex items-center bg-black/40 backdrop-blur-sm justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e5e7eb] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex items-center border-[#f3f4f6] bg-linear-to-br from-[#eff6ff] to-[#dbeafe] justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green text-gray-light flex items-center justify-center shadow-sm">
              <User size={18} />
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
              <span className="w-4 h-px inline-block bg-gray-low-soft" />
              Personal Info
              <span className="flex-1 h-px inline-block bg-gray-low-soft" />
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
                    className={`w-full text-dark border font-body  text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none  ${
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
                    className={`w-full text-dark border font-body  text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none  ${
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
                  className={`w-full text-dark border font-body  text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none  ${
                    errors.phone
                      ? "border-[#fca5a5] bg-[#fff7f7]"
                      : "border-[#e5e7eb] bg-white"
                  }`}
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
              <span className="w-4 h-px inline-block bg-gray-low-soft" />
              Job Info
              <span className="flex-1 h-px inline-block bg-gray-low-soft" />
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
                    className={`w-full text-dark border font-body  text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none  ${
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
                    className={`w-full text-dark border font-body  text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none  ${
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
                  className={`w-full text-dark border font-body  text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none  ${
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

            {/* Server Error */}
            {serverError && (
              <div className="flex items-center bg-[#fee2e2] gap-2 px-4 py-2.5 rounded-xl">
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">
                  {serverError}
                </p>
              </div>
            )}

            {/* Success */}
            {isSuccess && (
              <div className="flex items-center bg-[#dcfce7] gap-2 px-4 py-2.5 rounded-xl">
                <p className="text-xs font-medium text-green-700">
                  Employee registered successfully!
                </p>
              </div>
            )}
          </div>

          <div className="h-px mx-6 bg-[#f3f4f6]" />

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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer disabled:opacity-60 shadow-sm bg-green"
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
