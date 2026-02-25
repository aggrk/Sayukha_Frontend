"use client";

import { AuthenticationContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useContext(AuthenticationContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError("root", { message });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-[#FAFAFA]">
      <Sidebar />

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md">
          <p className="mb-3 text-sm font-medium tracking-widest text-[#0E7A3E] uppercase">
            Staff Portal
          </p>
          <h1 className="mb-8 text-3xl font-semibold text-[#FAFAFA]">
            Sign In
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-[#D1D5DB]">
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
                className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-5 py-4 text-[#FAFAFA] transition-all duration-200 placeholder:text-white/20 focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-red-500"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-[#D1D5DB]">Password</label>
                <a
                  href="/forgot-password"
                  className="text-xs text-[#D1D5DB]/50 transition-colors duration-200 hover:text-[#0E7A3E]"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-5 py-4 text-[#FAFAFA] transition-all duration-200 placeholder:text-white/20 focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-red-500"
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Root/server error */}
            {errors.root && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400">{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#C1121F] py-4 text-center text-sm font-semibold tracking-wide text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9B0E18] hover:shadow-[0_10px_25px_rgba(193,18,31,0.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#D1D5DB] opacity-50">
            Authorised personnel only.
          </p>
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
