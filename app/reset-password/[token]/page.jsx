"use client";

import { use, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import api from "../../../lib/api";
import {
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export default function ResetPasswordPage({ params }) {
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { token } = use(params);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    try {
      await api.patch(`/users/reset-password-on-registration/${token}`, {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        "Something went wrong. Please try again.";
      setError("root", { message });
    }
  };

  return (
    <div className="text-white-soft flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md">
          {/* Back to login */}
          <Link
            href="/login"
            className="text-gray-soft/40 hover:text-green-light mb-10 inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors duration-200"
          >
            <ArrowLeft size={13} />
            Back to Sign In
          </Link>

          {!success ? (
            <>
              <p className="text-green-light mb-3 text-sm font-medium tracking-widest uppercase">
                Account Recovery
              </p>
              <h1 className="text-white-soft mb-3 text-3xl font-semibold">
                Reset Password
              </h1>
              <p className="text-gray-soft/60 mb-8 text-sm leading-relaxed">
                Choose a strong new password for your account. It must be at
                least 8 characters long.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="text-gray-soft mb-2 block text-sm">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      className="focus:border-green focus:ring-green text-white-soft bg-dark w-full rounded-lg border border-white/10 px-5 py-4 pr-12 transition-all duration-200 placeholder:text-white/20 focus:ring-1 focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-red-500"
                      aria-invalid={errors.password ? "true" : "false"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-white/30 transition-colors duration-200 hover:text-white/60"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-gray-soft mb-2 block text-sm">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === passwordValue || "Passwords do not match",
                      })}
                      className="focus:border-green focus:ring-green text-white-soft bg-dark w-full rounded-lg border border-white/10 px-5 py-4 pr-12 transition-all duration-200 placeholder:text-white/20 focus:ring-1 focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-red-500"
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-white/30 transition-colors duration-200 hover:text-white/60"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Root/server error */}
                {errors.root && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400">
                      {errors.root.message}
                    </p>
                  </div>
                )}

                {/* No token warning */}
                {!token && (
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
                    <p className="text-sm text-yellow-400">
                      Invalid or missing reset token. Please request a new reset
                      link.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="hover:bg-green-light bg-green flex w-full cursor-pointer items-center justify-center rounded-lg py-4 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(11,107,58,0.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              <p className="text-gray-soft mt-8 text-center text-sm opacity-50">
                Authorised personnel only.
              </p>
            </>
          ) : (
            /* ── Success State ── */
            <div className="text-center">
              <div className="border-green/30 bg-green/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
                <ShieldCheck size={28} className="text-green-light" />
              </div>

              <p className="mb-3 text-sm font-medium tracking-widest text-[#0E7A3E] uppercase">
                All Done
              </p>
              <h1 className="text-white-soft mb-3 text-3xl font-semibold">
                Password Updated
              </h1>
              <p className="text-gray-soft/60 mb-10 text-sm leading-relaxed">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>

              <Link
                href="/login"
                className="bg-green hover:bg-green-light inline-flex items-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(11,107,58,0.25)]"
              >
                <KeyRound size={14} />
                Sign In Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="hidden w-2/5 flex-col justify-center border-r border-white/5 bg-[#1A1A1A] px-20 lg:flex">
      <div className="mb-20 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center">
          <Image
            src="/logo.png"
            width={64}
            height={64}
            alt="logo"
            className="h-full w-full object-contain drop-shadow-md"
          />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-wide text-[#FAFAFA]">
            SAYUKHA
          </p>
          <p className="text-xs tracking-widest text-[#D1D5DB] uppercase opacity-60">
            Construct Ltd
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <h2 className="mb-6 text-4xl leading-tight font-semibold">
          Sayukha Management System
          <br />
          <span className="text-[#0E7A3E]">Staff Portal</span>
        </h2>
        <p className="text-base leading-relaxed text-[#D1D5DB] opacity-80">
          Secure internal system for overseeing infrastructure projects,
          financial operations and executive reporting across Tanzania.
        </p>
      </div>
    </div>
  );
}
