"use client";

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import api from "../../../lib/api";

export default function EditModal({ report, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      report_summary: report?.report_summary ?? "",
      report_date: report?.report_date?.slice(0, 10) ?? "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await api.patch(`/reports/${report.id}`, data);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-linear-to-r from-green-50 to-emerald-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-light flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
              <Pencil size={17} className="text-gray-light" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-gray-800">
                Update Report
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                Edit the report details below
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-black/5"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            {/* Report Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Report Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("report_date", {
                    required: "Report date is required.",
                  })}
                  className={`focus:border-green focus:ring-green/10 text-dark rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${errors.report_date ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {errors.report_date && (
                  <p className="text-[11px] text-red-500">
                    {errors.report_date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Report Summary */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Report Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Enter report summary..."
                {...register("report_summary", {
                  required: "Report summary is required.",
                })}
                className={`focus:border-green focus:ring-green/10 text-dark resize-none rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${errors.report_summary ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.report_summary && (
                <p className="text-[11px] text-red-500">
                  {errors.report_summary.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5">
                <X size={13} className="shrink-0 text-red-500" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 px-6 pt-3 pb-5">
            <button
              type="submit"
              disabled={loading}
              className="bg-green shadow-green/20 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                "Update Report"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
