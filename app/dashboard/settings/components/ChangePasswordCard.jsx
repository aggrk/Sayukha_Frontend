"use client";

import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../lib/api";
import { useAuth } from "../../../../hooks/useAuth";

export default function ChangePasswordCard() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await api.patch("/users/updateMyPassword", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      setSuccessMsg(
        "Password updated successfully. Please log in again if prompted.",
      );
      reset();
      logout();
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ??
          "Failed to update password. Please try again.",
      );
    }
  };

  return (
    <div className="border-gray-soft/50 overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Card Header */}
      <div className="border-gray-soft/50 flex items-center gap-3 border-b px-6 py-5 sm:px-8">
        <div className="bg-green/10 flex h-9 w-9 items-center justify-center rounded-xl">
          <Lock size={16} className="text-green" />
        </div>
        <div>
          <h2 className="font-heading text-base font-bold text-black">
            Change Password
          </h2>
          <p className="font-body text-dark/45 text-xs">
            Update your account password
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-6 sm:px-8">
        {/* Alerts */}
        {successMsg && (
          <div className="border-green/20 bg-green/8 font-body text-green mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="border-red/20 bg-red/8 text-red font-body mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Current Password */}
            <div className="sm:col-span-2">
              <FormField
                label="Current Password"
                id="current_password"
                error={errors.current_password?.message}
              >
                <PasswordInput
                  id="current_password"
                  name="current_password"
                  placeholder="Enter current password"
                  register={register}
                  errors={errors}
                  rules={{ required: "Current password is required" }}
                />
              </FormField>
            </div>

            {/* New Password */}
            <FormField
              label="New Password"
              id="new_password"
              error={errors.new_password?.message}
            >
              <PasswordInput
                id="new_password"
                name="new_password"
                placeholder="Enter new password"
                register={register}
                errors={errors}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (val) =>
                    val !== watch("current_password") ||
                    "New password must differ from current",
                }}
              />
            </FormField>

            {/* Confirm Password */}
            <FormField
              label="Confirm New Password"
              id="confirm_password"
              error={errors.confirm_password?.message}
            >
              <PasswordInput
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirm new password"
                register={register}
                errors={errors}
                rules={{
                  required: "Please confirm your new password",
                  validate: (val) =>
                    val === newPassword || "Passwords do not match",
                }}
              />
            </FormField>
          </div>

          {/* Password strength hint */}
          <p className="font-body text-dark/40 mb-5 text-xs">
            Use at least 8 characters. A strong password includes uppercase
            letters, numbers, and symbols.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green hover:bg-green-light flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
