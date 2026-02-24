"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, X } from "lucide-react";
import api from "../../../lib/api";
import toast from "react-hot-toast";

export default function DeleteModal({ expense, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.delete(`/expenses/${expense.id}`);
      if (res?.data?.status === "success")
        toast.success("Expense Deleted Succesfully!");
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to delete expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-linear-to-r from-red-50 to-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shadow-sm">
              <Trash2 size={17} className="text-red" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 font-heading">
                Delete Expense
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                This action cannot be undone
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

        <div className="px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">
              "{expense.description || "this expense"}"
            </span>
            ? This cannot be reversed.
          </p>
          {error && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
              <X size={13} className="text-red-500 shrink-0" />
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="px-6 pb-5 flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-red to-red-dark hover:opacity-90 disabled:opacity-60 transition-all shadow-md shadow-red-200"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
