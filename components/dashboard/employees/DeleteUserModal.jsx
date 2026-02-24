"use client";

import { useState } from "react";
import api from "../../../lib/api";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { getInitials } from "../../../lib/utils";

export default function DeleteUserModal({ employee, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/users/${employee.id}`);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bg-[rgba(0,0,0,0.45)] backdrop-blur-[5px] inset-0 z-50 flex items-center justify-center p-4 h-full">
      <div className="w-full max-w-sm bg-white border border-[#e5e7eb] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center gap-3">
          {/* Warning Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#fee2e2] flex items-center justify-center mb-1">
            <AlertTriangle size={26} style={{ color: "#dc2626" }} />
          </div>

          <div>
            <p className="text-base font-bold font-heading text-gray-800">
              Delete Employee
            </p>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {employee.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          {/* Employee Card */}
          <div className="w-full flex items-center bg-[#fff7f7] border-[#fecaca] gap-3 px-4 py-3 rounded-xl border mt-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 bg-linear-to-br from-green to-chart-300">
              {getInitials(employee.name)}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700">
                {employee.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {employee.position ?? employee.email}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 flex items-center bg-[#fee2e2] gap-2 px-4 py-2.5 rounded-xl">
            <X size={13} className="text-red-500 shrink-0" />
            <p className="text-xs font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-xl bg-[#e5e7eb] text-[#6b7280] text-sm font-semibold border transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-br from-inactive-dot to-[#ef4444] transition-all hover:opacity-90 disabled:opacity-60 shadow-sm "
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
