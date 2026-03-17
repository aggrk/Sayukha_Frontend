"use client";

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Pencil, Paperclip, X } from "lucide-react";
import api from "../../../lib/api";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_SIZE_MB = 10;

export default function EditModal({ report, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notes: report?.notes ?? "",
      report_date: report?.report_date?.slice(0, 10) ?? "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("report_date", data.report_date);
      // notes is optional — only append if non-empty
      if (data.notes?.trim()) formData.append("notes", data.notes.trim());
      // file is optional — only append if the user picked a new one
      if (data.file?.[0]) formData.append("file", data.file[0]);

      await api.patch(`/reports/${report.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
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
                className={`focus:border-green focus:ring-green/10 text-dark rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
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

            {/* Notes (optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Notes{" "}
                <span className="font-normal text-gray-400 normal-case">
                  (optional)
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Add any notes about this report..."
                {...register("notes")}
                className="focus:border-green focus:ring-green/10 text-dark resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2"
              />
            </div>

            {/* Replace File (optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Replace File{" "}
                <span className="font-normal text-gray-400 normal-case">
                  (optional)
                </span>
              </label>

              {/* Current file pill */}
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Paperclip size={13} className="shrink-0 text-gray-400" />
                <p
                  className="min-w-0 flex-1 truncate text-[12px] text-gray-500"
                  title={report.file_original_name}
                >
                  Current:{" "}
                  <span className="font-medium text-gray-700">
                    {report.file_original_name ?? "—"}
                  </span>
                </p>
              </div>

              {/* File picker */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition-colors ${
                  errors.file
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50/40"
                }`}
              >
                <Paperclip size={15} className="shrink-0 text-gray-400" />
                <span className="text-[13px] text-gray-500">
                  {selectedFileName ?? "Click to upload a new file…"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  {...register("file", {
                    validate: {
                      type: (files) => {
                        if (!files?.[0]) return true; // optional
                        return (
                          ACCEPTED_TYPES.includes(files[0].type) ||
                          "Only PDF, Word, or Excel files are allowed."
                        );
                      },
                      size: (files) => {
                        if (!files?.[0]) return true;
                        return (
                          files[0].size <= MAX_SIZE_MB * 1024 * 1024 ||
                          `File must be under ${MAX_SIZE_MB} MB.`
                        );
                      },
                    },
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      setSelectedFileName(file ? file.name : null);
                    },
                  })}
                />
              </label>

              {errors.file && (
                <p className="text-[11px] text-red-500">
                  {errors.file.message}
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
