"use client";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { AuthenticationContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-[#FAFAFA]">
      <Sidebar />

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md">
          <p className="text-sm uppercase tracking-widest text-[#0E7A3E] mb-3 font-medium">
            Staff Portal
          </p>
          <h1 className="text-3xl font-semibold mb-8 text-[#FAFAFA]">
            Sign In
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-[#D1D5DB]">
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
                className="w-full px-5 py-4 bg-[#1A1A1A] border border-white/10 rounded-lg
                           text-[#FAFAFA] placeholder:text-white/20
                           focus:outline-none focus:border-[#0B6B3A] focus:ring-1
                           focus:ring-[#0B6B3A] transition-all duration-200
                           aria-invalid:border-red-500 aria-invalid:ring-red-500"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#D1D5DB]">
                Password
              </label>
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
                className="w-full px-5 py-4 bg-[#1A1A1A] border border-white/10 rounded-lg
                           text-[#FAFAFA] placeholder:text-white/20
                           focus:outline-none focus:border-[#0B6B3A] focus:ring-1
                           focus:ring-[#0B6B3A] transition-all duration-200
                           aria-invalid:border-red-500 aria-invalid:ring-red-500"
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
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg text-sm font-semibold tracking-wide uppercase
                         bg-[#C1121F] text-white transition-all duration-300
                         hover:bg-[#9B0E18] hover:-translate-y-0.5
                         hover:shadow-[0_10px_25px_rgba(193,18,31,0.25)]
                         active:translate-y-0 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-[#D1D5DB] opacity-50">
            Authorised personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-center w-2/5 px-20 bg-[#1A1A1A] border-r border-white/5">
      <div className="flex items-center gap-4 mb-20">
        <div className="w-16 h-16 flex items-center justify-center">
          <Image
            src="/logo.png"
            width={64}
            height={64}
            alt="logo"
            className="object-contain w-full h-full drop-shadow-md"
          />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-wide text-[#FAFAFA]">
            SAYUKHA
          </p>
          <p className="text-xs text-[#D1D5DB] tracking-widest uppercase opacity-60">
            Construct Ltd
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <h2 className="text-4xl font-semibold leading-tight mb-6">
          Sayukha Management System
          <br />
          <span className="text-[#0E7A3E]">Staff Portal</span>
        </h2>
        <p className="text-base text-[#D1D5DB] opacity-80 leading-relaxed">
          Secure internal system for overseeing infrastructure projects,
          financial operations and executive reporting across Tanzania.
        </p>
      </div>
    </div>
  );
}
