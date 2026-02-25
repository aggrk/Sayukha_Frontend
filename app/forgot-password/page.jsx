"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import api from "../../lib/api";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/users/forgotPassword", { email: data.email });
      setSubmittedEmail(data.email);
      setSubmitted(true);
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

          {!submitted ? (
            <>
              <p className="text-green-light mb-3 text-sm font-medium tracking-widest uppercase">
                Account Recovery
              </p>
              <h1 className="text-white-soft mb-3 text-3xl font-semibold">
                Forgot Password
              </h1>
              <p className="text-gray-soft/60 mb-8 text-sm leading-relaxed">
                Enter your registered email address and we'll send you a link to
                reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="text-gray-soft mb-2 block text-sm">
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
                    className="focus:border-green focus:ring-green text-white-soft bg-dark w-full rounded-lg border border-white/10 px-5 py-4 transition-all duration-200 placeholder:text-white/20 focus:ring-1 focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-red-500"
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.email.message}
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hover:bg-green-light bg-green flex w-full cursor-pointer items-center justify-center rounded-lg py-4 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(11,107,58,0.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Send Reset Link"
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
              {/* Icon */}
              <div className="border-green/30 bg-green/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
                <MailCheck size={28} className="text-green-light" />
              </div>

              <p className="mb-3 text-sm font-medium tracking-widest text-[#0E7A3E] uppercase">
                Check Your Inbox
              </p>
              <h1 className="text-white-soft mb-3 text-3xl font-semibold">
                Email Sent
              </h1>
              <p className="text-gray-soft/60 mb-2 text-sm leading-relaxed">
                We've sent a password reset link to
              </p>
              <p className="text-white-soft mb-8 text-sm font-semibold">
                {submittedEmail}
              </p>
              <p className="text-gray-soft/40 mb-10 text-xs leading-relaxed">
                Didn't receive it? Check your spam folder or wait a few minutes.
                The link will expire in 10 minutes.
              </p>

              <Link
                href="/login"
                className="bg-dark text-gray-soft hover:border-green/50 hover:text-white-soft inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold transition-all duration-200"
              >
                <ArrowLeft size={14} />
                Return to Sign In
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
