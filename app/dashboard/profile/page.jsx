"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../lib/api";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  CircleDot,
  CreditCard,
  DollarSign,
  Pencil,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useQueryClient, useMutation } from "@tanstack/react-query";

// ─── Field Display Component ────────────────────────────────────────────────
function InfoField({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="border-gray-soft/60 bg-gray-light flex items-start gap-3 rounded-xl border p-4">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent ? "bg-green/10" : "bg-dark/8"}`}
      >
        <Icon size={15} className={accent ? "text-green" : "text-dark/60"} />
      </div>
      <div className="min-w-0">
        <p className="font-heading text-dark/45 mb-0.5 text-xs font-medium tracking-wider uppercase">
          {label}
        </p>
        <p className="font-body text-dark truncate text-sm font-semibold">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isActive =
    status?.toLowerCase() === "active" || status?.toLowerCase() === "enabled";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${isActive ? "bg-green/12 text-green" : "bg-red/10 text-red"}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green" : "bg-red"}`}
      />
      {status ?? "Unknown"}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    name,
    email,
    role,
    status,
    account_number,
    basic_salary,
    position,
    phone,
  } = user?.data ?? {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { name, email, phone } });

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: (data) => api.patch("/users/updateMe", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsEditing(false);
    },
  });

  const handleCancel = () => {
    setIsEditing(false);
    reset({ name, email, phone });
  };

  if (!user) return <LoadingSpinner />;

  const successMsg = isSuccess ? "Profile updated successfully." : "";
  const errorMsg = isError
    ? (error?.response?.data?.message ?? "Failed to update profile. Try again.")
    : "";

  return (
    <div className="bg-white-soft flex min-h-screen flex-col items-center px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-8 w-full max-w-5xl">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-black sm:text-3xl">
          My Profile
        </h1>
        <p className="font-body text-dark/50 mt-1 text-sm">
          View and manage your personal information
        </p>
      </div>

      <div className="border-gray-soft/50 w-full max-w-5xl overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="px-6 pb-6 sm:px-8">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div className="flex min-w-0 items-end gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-md">
                <span className="font-heading text-green text-xl font-bold">
                  {name?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div className="mb-1 min-w-0">
                <h2 className="font-heading truncate text-lg leading-tight font-bold text-black">
                  {name}
                </h2>
                <p className="font-body text-dark/50 truncate text-sm">
                  {position}
                </p>
              </div>
            </div>

            <div className="mb-1 shrink-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green hover:bg-green-light flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors duration-200"
                >
                  <Pencil size={14} />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="text-dark bg-gray-light hover:bg-gray-soft flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Alerts */}
          {successMsg && (
            <div className="border-green/20 bg-green/8 font-body text-green mb-5 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium">
              <CheckCircle2 size={16} className="shrink-0" /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="border-red/20 bg-red/8 font-body text-red mb-5 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium">
              <AlertCircle size={16} className="shrink-0" /> {errorMsg}
            </div>
          )}

          {/* ── READ-ONLY VIEW ── */}
          {!isEditing && (
            <>
              <p className="font-heading text-dark/40 mb-3 text-xs font-semibold tracking-widest uppercase">
                Personal Information
              </p>
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoField icon={User} label="Full Name" value={name} accent />
                <InfoField
                  icon={Mail}
                  label="Email Address"
                  value={email}
                  accent
                />
                <InfoField
                  icon={Phone}
                  label="Phone Number"
                  value={phone}
                  accent
                />
                <InfoField icon={Briefcase} label="Position" value={position} />
              </div>
              <p className="font-heading text-dark/40 mb-3 text-xs font-semibold tracking-widest uppercase">
                Account Details
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoField icon={ShieldCheck} label="Role" value={role} />
                <div className="border-gray-soft/60 bg-gray-light flex items-start gap-3 rounded-xl border p-4">
                  <div className="bg-dark/8 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <CircleDot size={15} className="text-dark/60" />
                  </div>
                  <div>
                    <p className="font-heading text-dark/45 mb-0.5 text-xs font-medium tracking-wider uppercase">
                      Status
                    </p>
                    <StatusBadge status={status} />
                  </div>
                </div>
                <InfoField
                  icon={CreditCard}
                  label="Account Number"
                  value={account_number}
                />
                <InfoField
                  icon={DollarSign}
                  label="Basic Salary"
                  value={
                    basic_salary != null
                      ? `$${Number(basic_salary).toLocaleString()}`
                      : null
                  }
                />
              </div>
            </>
          )}

          {/* ── EDIT FORM ── */}
          {isEditing && (
            <form onSubmit={handleSubmit((data) => mutate(data))} noValidate>
              <p className="font-heading text-dark/40 mb-4 text-xs font-semibold tracking-widest uppercase">
                Edit Personal Information
              </p>

              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-dark text-sm font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={`bg-gray-light font-body focus:border-green focus:ring-green/25 w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all duration-200 outline-none focus:ring-2 ${errors.name ? "border-red bg-red/5" : "border-gray-soft"}`}
                  />
                  {errors.name && (
                    <p className="font-body text-red flex items-center gap-1 text-xs">
                      <AlertCircle size={11} /> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-dark text-sm font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    className={`bg-gray-light font-body focus:border-green focus:ring-green/25 w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all duration-200 outline-none focus:ring-2 ${errors.email ? "border-red bg-red/5" : "border-gray-soft"}`}
                  />
                  {errors.email && (
                    <p className="font-body text-red flex items-center gap-1 text-xs">
                      <AlertCircle size={11} /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-dark text-sm font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+\d\s\-().]{7,20}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                    className={`bg-gray-light font-body focus:border-green focus:ring-green/25 w-full rounded-xl border px-4 py-2.5 text-sm text-black transition-all duration-200 outline-none focus:ring-2 ${errors.phone ? "border-red bg-red/5" : "border-gray-soft"}`}
                  />
                  {errors.phone && (
                    <p className="font-body text-red flex items-center gap-1 text-xs">
                      <AlertCircle size={11} /> {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <p className="font-heading text-dark/40 mb-4 text-xs font-semibold tracking-widest uppercase">
                Read-only Information
              </p>
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoField icon={Briefcase} label="Position" value={position} />
                <InfoField icon={ShieldCheck} label="Role" value={role} />
                <div className="border-gray-soft/60 bg-gray-light flex items-start gap-3 rounded-xl border p-4">
                  <div className="bg-dark/8 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <CircleDot size={15} className="text-dark/60" />
                  </div>
                  <div>
                    <p className="font-heading text-dark/45 mb-0.5 text-xs font-medium tracking-wider uppercase">
                      Status
                    </p>
                    <StatusBadge status={status} />
                  </div>
                </div>
                <InfoField
                  icon={CreditCard}
                  label="Account Number"
                  value={account_number}
                />
                <InfoField
                  icon={DollarSign}
                  label="Basic Salary"
                  value={
                    basic_salary != null
                      ? `$${Number(basic_salary).toLocaleString()}`
                      : null
                  }
                />
              </div>

              <div className="border-gray-soft/50 flex items-center gap-3 border-t pt-4">
                <button
                  type="submit"
                  disabled={isPending || !isDirty}
                  className="bg-green hover:bg-green-light flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-dark/60 hover:bg-gray-light hover:text-dark cursor-pointer rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
