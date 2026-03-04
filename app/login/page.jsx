"use client";

import { AuthenticationContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useContext(AuthenticationContext);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="bg-dark text-white-soft flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md">
          <p className="text-green-light mb-3 text-sm font-medium tracking-widest uppercase">
            Staff Portal
          </p>
          <h1 className="text-white-soft mb-8 text-3xl font-semibold">
            Sign In
          </h1>

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
                className="text-white-soft focus:ring-green focus:border-green bg-dark w-full rounded-lg border border-white/10 px-5 py-4 transition-all duration-200 placeholder:text-white/20 focus:ring-1 focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-red-500"
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
                <label className="text-gray-soft text-sm">Password</label>
                <a
                  href="/forgot-password"
                  className="hover:text-green-light text-gray-soft/50 text-xs transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="text-white-soft focus:border-green focus:ring-green bg-dark w-full rounded-lg border border-white/10 px-5 py-4 pr-12 transition-all duration-200 placeholder:text-white/20 focus:ring-1 focus:outline-none aria-invalid:border-red-500 aria-invalid:ring-red-500"
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white/30 transition-colors duration-200 hover:text-white/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

          <p className="text-gray-soft mt-8 text-center text-sm opacity-50">
            Authorised personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
