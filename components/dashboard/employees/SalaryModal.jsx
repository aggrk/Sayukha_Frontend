"use client";

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Banknote, Loader2, Wallet, X } from "lucide-react";
import api from "../../../lib/api";
import { getCurrentMonth } from "../../../lib/utils";
import useFetch from "../../../hooks/useFetch";

export default function SalaryModal({ employee, type, onClose }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      month: getCurrentMonth(),
      amount: "",
      notes: "",
    },
  });

  const watchedMonth = watch("month");

  const params = {
    employee_id: employee.id,
    payment_month: watchedMonth,
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: employeeSalaryData } = useFetch(
    "salary-payments",
    "/salary-payments",
    params,
  );
  const salaryData = employeeSalaryData?.data?.[0] ?? null;

  const isAdvance = type === "advance";
  const endpoint = isAdvance
    ? "/salary-payments/advance"
    : "/salary-payments/full";
  const amountKey = isAdvance ? "advance_amount" : "full_payment_amount";

  const isSalaryPaid =
    salaryData &&
    Math.ceil(salaryData.balance) === 0 &&
    salaryData.status === "paid";

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await api.post(endpoint, {
        employee_id: employee.id,
        month: data.month,
        [amountKey]: data.amount,
        notes: data.notes,
      });
      await queryClient.invalidateQueries({
        queryKey: ["salary-payments", employee.id, watchedMonth],
      });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 h-full">
      <div className="w-full max-w-md bg-white border border-[#e5e7eb] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex bg-linear-to-br from-[#dcfce7] to-[#d1fae5] items-center border-[#f3f4f6] justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-[#bbf7d0]">
              {isAdvance ? (
                <Wallet size={18} className="text-green" />
              ) : (
                <Banknote size={18} className="text-green" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 font-heading">
                {isAdvance ? "Advance Salary" : "Full Salary Payment"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{employee.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Salary Info Bar */}
        <div className="px-6 py-3 border-b flex bg-[#f9fafb] border-[#f3f4f6] flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Basic Salary
            </span>
            <span className="text-sm font-bold text-gray-700">
              {Number(employee.basic_salary).toLocaleString()} TSH / mo
            </span>
          </div>

          <span className="w-px h-8 bg-gray-200 hidden sm:block" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Status
            </span>
            {!salaryData ? (
              <span className="text-sm font-semibold text-green">
                No payment record yet
              </span>
            ) : isSalaryPaid ? (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Fully paid
              </span>
            ) : (
              <span className="text-sm font-semibold text-orange-500">
                Balance: {Number(salaryData.balance).toLocaleString()} TSH
              </span>
            )}
          </div>

          <span className="w-px h-8 bg-gray-200 hidden sm:block" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Account
            </span>
            <span className="text-sm font-bold text-gray-700">
              {employee.account_number ?? "—"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Month */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Month <span className="text-red-400">*</span>
              </label>
              <input
                type="month"
                {...register("month", { required: "Month is required." })}
                className={`font-body text-dark text-sm px-4 py-2.5 rounded-xl border outline-none ${errors.month ? "border-[#f87171]" : "border-[#e5e7eb]"}`}
              />
              {errors.month && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.month.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {isAdvance ? "Advance Amount" : "Full Payment Amount"}{" "}
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  {...register("amount", {
                    required: "Amount is required.",
                    min: {
                      value: 1,
                      message: "Amount must be greater than 0.",
                    },
                  })}
                  className={`w-full text-sm px-4 py-2.5 text-dark rounded-xl ${errors.amount ? "border-[#f87171]" : "border-[#e5e7eb]"} border outline-none pr-16`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  TSH
                </span>
              </div>
              {errors.amount && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Notes
              </label>
              <textarea
                placeholder="Optional notes..."
                rows={3}
                {...register("notes")}
                className="text-sm px-4 py-2.5 text-dark rounded-xl border-[#e5e7eb] font-heading border outline-none resize-none"
              />
            </div>

            {/* API Error */}
            {error && (
              <div className="flex items-center gap-2 bg-[#fee2e2] px-4 py-2.5 rounded-xl">
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 bg-[#dcfce7] px-4 py-2.5 rounded-xl">
                <p className="text-xs font-medium text-green-700">
                  Payment recorded successfully!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSalaryPaid || loading || success}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-md disabled:opacity-60 cursor-pointer bg-linear-to-br from-green to-green-light"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isAdvance ? (
                <Wallet size={15} />
              ) : (
                <Banknote size={15} />
              )}
              {loading
                ? "Processing..."
                : isAdvance
                  ? "Pay Advance"
                  : "Pay Full Salary"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm text-[#6b7280] border-[#e5e7eb] font-semibold border transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
