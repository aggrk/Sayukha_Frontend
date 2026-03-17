"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Paperclip, Trash2, X } from "lucide-react";
import api from "../../../lib/api";

export default function DeleteModal({ report, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/reports/${report.id}`);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to delete report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-linear-to-r from-red-50 to-rose-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 shadow-sm">
              <Trash2 size={17} className="text-red" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-gray-800">
                Delete Report
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                This action cannot be undone
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

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the report for{" "}
            <span className="font-semibold text-gray-800">
              "{report.project_name || "this project"}"
            </span>
            ? This cannot be reversed.
          </p>

          {/* Attached file notice */}
          {report.file_original_name && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
              <Paperclip size={13} className="shrink-0 text-orange-400" />
              <p className="min-w-0 flex-1 truncate text-[12px] text-orange-700">
                The attached file{" "}
                <span
                  className="font-semibold"
                  title={report.file_original_name}
                >
                  {report.file_original_name}
                </span>{" "}
                will also be permanently deleted.
              </p>
            </div>
          )}

          {/* API Error */}
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5">
              <X size={13} className="shrink-0 text-red-500" />
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-5">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="from-red to-red-dark flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "Yes, Delete"
            )}
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
