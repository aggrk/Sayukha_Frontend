"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Tag } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import toast from "react-hot-toast";

const CATEGORY_TYPES = ["operational", "salary", "capital"];

export default function CategoryModal({ category, onClose }) {
  const isEdit = Boolean(category);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: category?.name ?? "",
      type: category?.type ?? "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({ name: category.name ?? "", type: category.type ?? "" });
    }
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        await api.patch(`/categories/${category.id}`, data);
      } else {
        await api.post("/categories", data);
      }
    },
    onSuccess: async () => {
      toast.success(isEdit ? "Category updated!" : "Category created!");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (err) => toast.error(err?.message ?? "Something went wrong"),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <Tag size={16} className="text-green" />
            </div>
            <h2 className="font-heading text-lg font-bold text-black">
              {isEdit ? "Edit Category" : "Add Category"}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-6 py-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-500 uppercase">
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. Office Supplies"
                {...register("name", { required: "Name is required" })}
                className={`bg-white-soft w-full rounded-xl border px-4 py-2.5 text-sm text-black placeholder-gray-400 transition outline-none focus:ring-2 focus:ring-green-100 ${
                  errors.name
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-green-400"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-500 uppercase">
                Type
              </label>
              <select
                {...register("type", { required: "Type is required" })}
                className={`bg-white-soft w-full rounded-xl border px-4 py-2.5 text-sm text-black transition outline-none focus:ring-2 focus:ring-green-100 ${
                  errors.type
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-green-400"
                }`}
              >
                <option value="">Select a type…</option>
                {CATEGORY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="from-green to-green-light inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0b6b3a35] transition-all duration-200 hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
