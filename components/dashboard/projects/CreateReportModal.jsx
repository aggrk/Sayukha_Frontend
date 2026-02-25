"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "../../../lib/api";
import { FileText, Loader2, X } from "lucide-react";

export default function CreateReportModal({ project, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      report_date: "",
      report_summary: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await api.post("/reports", {
        project_id: project.id,
        report_date: data.report_date,
        report_summary: data.report_summary,
      });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[5px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-linear-to-br from-blue-50 to-indigo-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 shadow-sm">
              <FileText size={17} className="text-blue-700" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-gray-800">
                Create Report
              </p>
              <p className="mt-0.5 max-w-55 truncate text-xs text-gray-400">
                {project.project_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-black/5"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 px-6 py-5">
            {/* Report Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Report Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("report_date", {
                  required: "Report date is required.",
                })}
                className={`text-dark focus:border-green focus:ring-green/10 rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                  errors.report_date
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
                }`}
              />
              {errors.report_date && (
                <p className="text-[11px] text-red-500">
                  {errors.report_date.message}
                </p>
              )}
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
                className={`text-dark focus:border-green focus:ring-green/10 resize-none rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                  errors.report_summary
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
                }`}
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
          <div className="flex items-center gap-3 px-6 pb-5">
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FileText size={15} />
              )}
              {loading ? "Creating..." : "Create Report"}
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
