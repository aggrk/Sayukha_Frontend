"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import api from "../../../lib/api";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FolderOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DEFAULT_LIMIT = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount == null) return "—";
  return Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 });
};

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
              page === currentPage
                ? "bg-[#0b6b3a] text-white shadow-md shadow-[#0b6b3a35] border border-[#0b6b3a]"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active: "bg-green-100 text-[#0b6b3a] border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    on_hold: "bg-amber-100 text-amber-700 border-amber-200",
    cancelled: "bg-red-100 text-[#c1121f] border-red-200",
  };
  const label = status?.replace("_", " ") ?? "—";
  const classes = map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${classes}`}
    >
      {label}
    </span>
  );
}

// ─── Project Modal (Add / Edit) ───────────────────────────────────────────────
function ProjectModal({ project = null, onClose }) {
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
        await api.patch(`/projects/${project.id}`, data);
      } else {
        await api.post("/projects", data);
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
    `text-sm px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-[#0b6b3a] focus:ring-2 focus:ring-[#0b6b3a]/10 text-[#1a1a1a] w-full ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[5px]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className={`px-6 py-5 flex items-center justify-between border-b border-gray-100 shrink-0 ${
            isEditing
              ? "bg-gradient-to-br from-amber-50 to-yellow-50"
              : "bg-gradient-to-br from-green-50 to-emerald-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                isEditing ? "bg-amber-100" : "bg-green-100"
              }`}
            >
              {isEditing ? (
                <Pencil size={17} className="text-amber-700" />
              ) : (
                <Plus size={17} className="text-[#0b6b3a]" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 font-[family-name:var(--font-heading)]">
                {isEditing ? "Update Project" : "Add New Project"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEditing
                  ? "Edit the project details below"
                  : "Fill in the project details below"}
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
            {/* Project Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("project_status", {
                    required: "Status is required.",
                  })}
                  className={inputClass(errors.project_status)}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
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
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter project description..."
                {...register("description")}
                className="text-sm px-4 py-2.5 rounded-xl border border-gray-200 outline-none resize-none transition-colors focus:border-[#0b6b3a] focus:ring-2 focus:ring-[#0b6b3a]/10 text-[#1a1a1a]"
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
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-md ${
                isEditing
                  ? "bg-gradient-to-r from-amber-600 to-yellow-500 shadow-[0_4px_14px_rgba(202,138,4,0.3)]"
                  : "bg-gradient-to-r from-[#0b6b3a] to-[#0e7a3e] shadow-[0_4px_14px_#0b6b3a35]"
              }`}
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

// ─── Create Report Modal ──────────────────────────────────────────────────────
function CreateReportModal({ project, onClose }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[5px]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm">
              <FileText size={17} className="text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 font-[family-name:var(--font-heading)]">
                Create Report
              </p>
              <p className="text-xs text-gray-400 mt-0.5 max-w-[220px] truncate">
                {project.project_name}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Report Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Report Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("report_date", {
                  required: "Report date is required.",
                })}
                className={`text-sm px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-[#0b6b3a] focus:ring-2 focus:ring-[#0b6b3a]/10 text-[#1a1a1a] ${
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
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Report Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Enter report summary..."
                {...register("report_summary", {
                  required: "Report summary is required.",
                })}
                className={`text-sm px-4 py-2.5 rounded-xl border outline-none resize-none transition-colors focus:border-[#0b6b3a] focus:ring-2 focus:ring-[#0b6b3a]/10 text-[#1a1a1a] ${
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
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
                <X size={13} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 disabled:opacity-60 transition-all shadow-md shadow-blue-200"
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

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ project, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/projects/${project.id}`);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to delete project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[5px]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-red-50 to-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shadow-sm">
              <Trash2 size={17} className="text-[#c1121f]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 font-[family-name:var(--font-heading)]">
                Delete Project
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
              "{project.project_name || "this project"}"
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
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#c1121f] to-[#9b0e18] hover:opacity-90 disabled:opacity-60 transition-all shadow-md shadow-[0_4px_14px_rgba(220,38,38,0.3)]"
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [reportProject, setReportProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useFetch("projects", "/projects", {
    page: currentPage,
    limit: DEFAULT_LIMIT,
  });

  const projects = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? data?.last_page ?? 1;
  const totalRecords = data?.meta?.total ?? data?.total ?? 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8 font-[family-name:var(--font-body)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0f0f0f] leading-tight font-[family-name:var(--font-heading)]">
              Projects
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all your projects
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {!isLoading && !isError && totalRecords > 0 && (
              <span className="bg-[#0b6b3a] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
                {totalRecords} {totalRecords === 1 ? "Project" : "Projects"}
              </span>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0b6b3a] to-[#0e7a3e] hover:opacity-90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-[#0b6b3a35] transition-all duration-200 hover:-translate-y-px whitespace-nowrap"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-sm py-16">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-[#0b6b3a] rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading projects…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl py-16">
            <p className="text-sm font-medium text-[#c1121f]">
              Failed to load projects. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-sm py-16">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <FolderOpen size={22} className="text-[#0b6b3a]" />
            </div>
            <p className="text-sm text-gray-400">No projects found.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b6b3a] hover:underline"
            >
              <Plus size={14} /> Add your first project
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && projects.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[1000px]">
              <thead>
                <tr>
                  {[
                    "Project",
                    "Location",
                    "Dates",
                    "Contract",
                    "Budget",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-[#fafafa] border-b border-gray-100"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={project.id ?? index}
                    className={`border-b border-gray-50 transition-colors duration-150 hover:bg-green-50/40 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                    }`}
                  >
                    {/* Project Name + Code */}
                    <td className="px-5 py-4 align-middle">
                      <p className="font-semibold text-[#0f0f0f] leading-snug">
                        {project.project_name || "—"}
                      </p>
                      <span className="inline-block mt-1 bg-green-50 text-[#0b6b3a] border border-green-200 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                        {project.project_code || "N/A"}
                      </span>
                      {project.description && (
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">
                          {project.description}
                        </p>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 align-middle text-gray-600 max-w-[140px] truncate">
                      {project.location || "—"}
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider">
                            Start:{" "}
                          </span>
                          {formatDate(project.start_date)}
                        </span>
                        <span className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider">
                            End:{" "}
                          </span>
                          {formatDate(project.end_date)}
                        </span>
                      </div>
                    </td>

                    {/* Contract Amount */}
                    <td className="px-5 py-4 align-middle font-bold text-[#0f0f0f] tabular-nums whitespace-nowrap">
                      {formatCurrency(project.contract_amount)}
                      <span className="text-[10px] font-normal text-gray-400 ml-1">
                        TSH
                      </span>
                    </td>

                    {/* Budget Amount */}
                    <td className="px-5 py-4 align-middle font-bold text-[#0f0f0f] tabular-nums whitespace-nowrap">
                      {formatCurrency(project.budget_amount)}
                      <span className="text-[10px] font-normal text-gray-400 ml-1">
                        TSH
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 align-middle">
                      <StatusBadge status={project.project_status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        {/* Create Report */}
                        <button
                          onClick={() => setReportProject(project)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors whitespace-nowrap"
                          title="Create report"
                        >
                          <FileText size={13} />
                          Report
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditProject(project)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors"
                          title="Edit project"
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteProject(project)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-[#c1121f] transition-colors"
                          title="Delete project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination + Footer */}
        {!isLoading && !isError && projects.length > 0 && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <p className="mt-4 text-xs text-gray-400 text-center">
              Page <strong className="text-gray-500">{currentPage}</strong> of{" "}
              <strong className="text-gray-500">{totalPages}</strong>
              {" · "}
              <strong className="text-gray-500">{totalRecords}</strong>{" "}
              {totalRecords === 1 ? "project" : "projects"} total
            </p>
          </>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <ProjectModal onClose={() => setShowAddModal(false)} />}
      {editProject && (
        <ProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
        />
      )}
      {deleteProject && (
        <DeleteModal
          project={deleteProject}
          onClose={() => setDeleteProject(null)}
        />
      )}
      {reportProject && (
        <CreateReportModal
          project={reportProject}
          onClose={() => setReportProject(null)}
        />
      )}
    </div>
  );
}
