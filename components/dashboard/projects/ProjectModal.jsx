"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "../../../lib/api";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ProjectModal({ project = null, onClose }) {
  const queryClient = useQueryClient();
  const isEditing = !!project;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      project_name: project?.project_name ?? "",
      project_code: project?.project_code ?? "",
      location: project?.location ?? "",
      description: project?.description ?? "",
      start_date: project?.start_date?.slice(0, 10) ?? "",
      end_date: project?.end_date?.slice(0, 10) ?? "",
      contract_amount: project?.contract_amount ?? "",
      budget_amount: project?.budget_amount ?? "",
      project_status: project?.project_status ?? "active",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      if (isEditing) {
        const res = await api.patch(`/projects/${project.id}`, data);
        if (res?.data?.status === "success")
          toast.success("Project Updated Succesfully!");
      } else {
        const res = await api.post("/projects", data);
        if (res?.data?.status === "success")
          toast.success("Project Added Succesfully!");
      }
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `text-sm px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/10 text-dark w-full ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[5px]">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-linear-to-br from-green-50 to-emerald-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 shadow-sm">
              {isEditing ? (
                <Pencil size={17} className="text-green" />
              ) : (
                <Plus size={17} className="text-green" />
              )}
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-gray-800">
                {isEditing ? "Update Project" : "Add New Project"}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                {isEditing
                  ? "Edit the project details below"
                  : "Fill in the project details below"}
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            {/* Project Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter project name..."
                {...register("project_name", {
                  required: "Project name is required.",
                })}
                className={inputClass(errors.project_name)}
              />
              {errors.project_name && (
                <p className="text-[11px] text-red-500">
                  {errors.project_name.message}
                </p>
              )}
            </div>

            {/* Project Code + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Project Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. PRJ-001"
                  {...register("project_code", {
                    required: "Project code is required.",
                  })}
                  className={inputClass(errors.project_code)}
                />
                {errors.project_code && (
                  <p className="text-[11px] text-red-500">
                    {errors.project_code.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("project_status", {
                    required: "Status is required.",
                  })}
                  className={inputClass(errors.project_status)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="on hold">On Hold</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.project_status && (
                  <p className="text-[11px] text-red-500">
                    {errors.project_status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Start Date + End Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("start_date", {
                    required: "Start date is required.",
                  })}
                  className={inputClass(errors.start_date)}
                />
                {errors.start_date && (
                  <p className="text-[11px] text-red-500">
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("end_date", {
                    required: "End date is required.",
                  })}
                  className={inputClass(errors.end_date)}
                />
                {errors.end_date && (
                  <p className="text-[11px] text-red-500">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contract Amount + Budget Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Contract Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    {...register("contract_amount", {
                      required: "Contract amount is required.",
                      min: { value: 0, message: "Must be a positive number." },
                    })}
                    className={`${inputClass(errors.contract_amount)} pr-14`}
                  />
                  <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-bold text-gray-400">
                    TSH
                  </span>
                </div>
                {errors.contract_amount && (
                  <p className="text-[11px] text-red-500">
                    {errors.contract_amount.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Budget Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    {...register("budget_amount", {
                      required: "Budget amount is required.",
                      min: { value: 0, message: "Must be a positive number." },
                    })}
                    className={`${inputClass(errors.budget_amount)} pr-14`}
                  />
                  <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-bold text-gray-400">
                    TSH
                  </span>
                </div>
                {errors.budget_amount && (
                  <p className="text-[11px] text-red-500">
                    {errors.budget_amount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter project location..."
                {...register("location", { required: "Location is required." })}
                className={inputClass(errors.location)}
              />
              {errors.location && (
                <p className="text-[11px] text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter project description..."
                {...register("description")}
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
          <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 px-6 pt-3 pb-5">
            <button
              type="submit"
              disabled={loading}
              className="from-green to-green-light flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-60"
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
                  ? "Update Project"
                  : "Add Project"}
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
