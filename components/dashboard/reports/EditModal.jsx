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
    console.log(data);
    try {
      const res = await api.patch(`/reports/${report.id}`, data);
      console.log(res);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 shrink-0 bg-linear-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-green-light">
              <Pencil size={17} className="text-gray-light" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 font-heading">
                Update Report
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Edit the report details below
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto flex-1">
            {/* Report Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col col-span-2 gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Report Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("report_date", {
                    required: "Report date is required.",
                  })}
                  className={`text-sm px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark ${errors.report_date ? "border-red-400 bg-red-50" : "border-gray-200"}`}
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
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Report Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Enter report summary..."
                {...register("report_summary", {
                  required: "Report summary is required.",
                })}
                className={`text-sm px-4 py-2.5 rounded-xl border outline-none resize-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark ${errors.report_summary ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.report_summary && (
                <p className="text-[11px] text-red-500">
                  {errors.report_summary.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 pt-3 flex items-center gap-3 border-t border-gray-100 shrink-0">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex cursor-pointer items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-md bg-green shadow-green/20"
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
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
