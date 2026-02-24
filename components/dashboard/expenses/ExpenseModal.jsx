"use client";

import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import api from "../../../lib/api";
import toast from "react-hot-toast";

export default function ExpenseModal({ expense = null, onClose }) {
  const queryClient = useQueryClient();
  const isEditing = !!expense;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: categoriesData } = useFetch("categories", "/categories");
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      expense_date: expense?.expense_date?.slice(0, 10) ?? "",
      description: expense?.description ?? "",
      amount: expense?.amount ?? "",
      category_id: expense?.category_id ?? "",
      unit: expense?.unit ?? "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      if (isEditing) {
        const res = await api.patch(`/expenses/${expense.id}`, data);
        if (res?.data?.status === "success")
          toast.success("Expense Updated Succesfully!");
      } else {
        const res = await api.post("/expenses", data);
        if (res?.data?.status === "success")
          toast.success("Expense Added Succesfully!");
      }
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 shrink-0 bg-linear-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-green-100">
              {isEditing ? (
                <Pencil size={17} className="text-green" />
              ) : (
                <Plus size={17} className="text-green" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 font-heading">
                {isEditing ? "Update Expense" : "Add New Expense"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEditing
                  ? "Edit the expense details below"
                  : "Fill in the expense details below"}
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

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto flex-1">
            {/* Expense Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Expense Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("expense_date", { required: "Date is required." })}
                className={`text-sm px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark ${errors.expense_date ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.expense_date && (
                <p className="text-[11px] text-red-500">
                  {errors.expense_date.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Enter expense description..."
                {...register("description", {
                  required: "Description is required.",
                })}
                className={`text-sm px-4 py-2.5 rounded-xl border outline-none resize-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark ${errors.description ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  {...register("amount", {
                    required: "Amount is required.",
                    min: {
                      value: 1,
                      message: "Amount must be greater than 0.",
                    },
                  })}
                  className={`w-full text-sm px-4 py-2.5 pr-16 rounded-xl border outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark ${errors.amount ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  TSH
                </span>
              </div>
              {errors.amount && (
                <p className="text-[11px] text-red-500">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category_id", {
                  required: "Category is required.",
                })}
                className={`text-sm px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark bg-white ${errors.category_id ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-[11px] text-red-500">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            {/* Unit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Unit{" "}
                <span className="text-gray-300 normal-case tracking-normal font-normal">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. kg, liters, pieces..."
                {...register("unit")}
                className="text-sm px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark"
              />
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
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-md 
                  bg-linear-to-r from-green to-green-light shadow-green-200"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isEditing ? (
                <Pencil size={15} />
              ) : (
                <Plus size={15} />
              )}
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Expense"
                  : "Add Expense"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
