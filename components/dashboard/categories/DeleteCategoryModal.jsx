"use client";

import { Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import toast from "react-hot-toast";

export default function DeleteCategoryModal({ category, onClose }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/categories/${category.id}`);
    },
    onSuccess: async () => {
      toast.success("Category deleted!");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (err) => toast.error(err?.message ?? "Failed to delete category"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <Trash2 size={16} className="text-red" />
            </div>
            <h2 className="font-heading text-lg font-bold text-black">
              Delete Category
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">
              {category?.name ?? "this category"}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-100 transition-all duration-200 hover:bg-red-600 disabled:opacity-60"
          >
            <Trash2 size={14} />
            {mutation.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
