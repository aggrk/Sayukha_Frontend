"use client";

import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { Plus, Pencil, Trash2, FolderOpen, FileText } from "lucide-react";
import { LIMIT, formatCurrency, formatDate } from "../../../lib/utils";
import Pagination from "../../ui/Pagination";
import ProjectModal from "./ProjectModal";
import DeleteModal from "./DeleteModal";
import CreateReportModal from "./CreateReportModal";

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
      className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${classes}`}
    >
      {label}
    </span>
  );
}

export default function ProjectsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [reportProject, setReportProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: projectData,
    isLoading,
    isError,
  } = useFetch("projects", "/projects", {
    page: currentPage,
    limit: LIMIT,
  });

  const projects = projectData?.data ?? [];
  const totalCount = projectData?.results ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-light font-body min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl leading-tight font-bold text-black">
              Projects
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your projects
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="from-green to-green-light inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-md shadow-[#0b6b3a35] transition-all duration-200 hover:-translate-y-px hover:opacity-90"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="border-t-green h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200" />
            <p className="text-sm text-gray-400">Loading projects…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16">
            <p className="text-red text-sm font-medium">
              Failed to load projects. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
              <FolderOpen size={22} className="text-green" />
            </div>
            <p className="text-sm text-gray-400">No projects found.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-green mt-1 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold hover:underline"
            >
              <Plus size={14} /> Add your first project
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && projects.length > 0 && (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-250 border-collapse text-sm">
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
                      className="bg-white-soft border-b border-gray-100 px-5 py-3.5 text-left text-[11px] font-bold tracking-widest text-gray-400 uppercase"
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
                      index % 2 === 0 ? "bg-white" : "bg-white-soft"
                    }`}
                  >
                    {/* Project Name + Code */}
                    <td className="px-5 py-4 align-middle">
                      <p className="leading-snug font-semibold text-black">
                        {project.project_name || "—"}
                      </p>
                      <span className="text-green mt-1 inline-block rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                        {project.project_code || "N/A"}
                      </span>
                      {project.description && (
                        <p className="mt-1 max-w-50 truncate text-xs text-gray-400">
                          {project.description}
                        </p>
                      )}
                    </td>

                    {/* Location */}
                    <td className="max-w-35 truncate px-5 py-4 align-middle text-gray-600">
                      {project.location || "—"}
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Start:{" "}
                          </span>
                          {formatDate(project.start_date)}
                        </span>
                        <span className="text-xs text-gray-500">
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            End:{" "}
                          </span>
                          {formatDate(project.end_date)}
                        </span>
                      </div>
                    </td>

                    {/* Contract Amount */}
                    <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                      {formatCurrency(project.contract_amount)}
                      <span className="ml-1 text-[10px] font-normal text-gray-400">
                        TSH
                      </span>
                    </td>

                    {/* Budget Amount */}
                    <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                      {formatCurrency(project.budget_amount)}
                      <span className="ml-1 text-[10px] font-normal text-gray-400">
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
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-blue-700 transition-colors hover:bg-blue-100"
                          title="Create report"
                        >
                          <FileText size={13} />
                          Report
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditProject(project)}
                          className="bg-green-light/20 text-green hover:bg-green-light/30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                          title="Edit project"
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteProject(project)}
                          className="text-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 transition-colors hover:bg-red-100"
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
              totalCount={totalCount}
              onChange={handlePageChange}
            />
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
