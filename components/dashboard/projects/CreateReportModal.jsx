"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "../../../lib/api";
import { FileText, Loader2, Paperclip, X } from "lucide-react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_SIZE_MB = 10;

export default function CreateReportModal({ project, onClose }) {
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
      report_date: "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("project_id", project.id);
      formData.append("report_date", data.report_date);
      if (data.notes?.trim()) formData.append("notes", data.notes.trim());
      formData.append("file", data.file[0]);

      await api.post("/reports", formData, {
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

            {/* File Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Report File <span className="text-red-500">*</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3.5 transition-colors ${
                  errors.file
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"
                }`}
              >
                <Paperclip
                  size={15}
                  className={`shrink-0 ${errors.file ? "text-red-400" : "text-gray-400"}`}
                />
                <span
                  className={`text-[13px] ${selectedFileName ? "font-medium text-gray-700" : "text-gray-400"}`}
                >
                  {selectedFileName ?? "Click to upload PDF, Word, or Excel…"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  {...register("file", {
                    required: "A report file is required.",
                    validate: {
                      type: (files) =>
                        ACCEPTED_TYPES.includes(files?.[0]?.type) ||
                        "Only PDF, Word, or Excel files are allowed.",
                      size: (files) =>
                        files?.[0]?.size <= MAX_SIZE_MB * 1024 * 1024 ||
                        `File must be under ${MAX_SIZE_MB} MB.`,
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
              <p className="text-[11px] text-gray-400">
                Accepted formats: PDF, DOC, DOCX, XLS, XLSX · Max {MAX_SIZE_MB}{" "}
                MB
              </p>
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
                className="text-dark focus:border-green focus:ring-green/10 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2"
              />
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
