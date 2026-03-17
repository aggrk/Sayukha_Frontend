"use client";

import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import Pagination from "../../ui/Pagination";
import { formatDate, LIMIT } from "../../../lib/utils";
import api from "../../../lib/api";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  MapPin,
  CalendarDays,
  FileSpreadsheet,
  FileType,
  Download,
  Eye,
} from "lucide-react";
import EditModal from "./EditModal";
import MetaItem from "../../ui/MetaItems";
import DeleteModal from "./DeleteModal";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";

// ─── File type helpers ────────────────────────────────────────────────────────

const FILE_META = {
  "application/pdf": {
    label: "PDF",
    icon: FileText,
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    label: "DOCX",
    icon: FileType,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
  },
  "application/msword": {
    label: "DOC",
    icon: FileType,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    label: "XLSX",
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  "application/vnd.ms-excel": {
    label: "XLS",
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
};

const getFileMeta = (mimeType) =>
  FILE_META[mimeType] ?? {
    label: "FILE",
    icon: FileText,
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
  };

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportPage() {
  const [editReport, setEditReport] = useState(null);
  const [deleteReport, setDeleteReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const endPoint =
    user?.data?.role === "admin" ? "/reports" : "/reports/my-reports";

  const {
    data: reportsData,
    isLoading,
    isError,
  } = useFetch("reports", endPoint, {
    page: currentPage,
    limit: LIMIT,
  });

  const reports = reportsData?.data ?? [];
  const totalCount = reportsData?.results ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // PDFs open inline in a new tab; Word/Excel are force-downloaded.
  // The api instance is used so auth headers are included.
  const handleFileAction = async (report) => {
    const isPdf = report.file_mime_type === "application/pdf";
    try {
      const response = await api.get(
        `/reports/${report.id}/file${isPdf ? "" : "?download=true"}`,
        { responseType: "blob" },
      );

      const objectUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: report.file_mime_type }),
      );

      if (isPdf) {
        window.open(objectUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute(
          "download",
          report.file_original_name ?? `report-${report.id}`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      window.URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error("Failed to open file. Please try again.");
    }
  };

  return (
    <div className="bg-gray-light font-body min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl leading-tight font-bold text-black">
              Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Project reports and summaries
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="border-t-green h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200" />
            <p className="text-sm text-gray-400">Loading reports…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16">
            <p className="text-red text-sm font-medium">
              Failed to load reports. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && reports.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
              <FileText size={22} className="text-green" />
            </div>
            <p className="text-sm text-gray-400">No reports available.</p>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && !isError && reports.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => {
              const fileMeta = getFileMeta(report.file_mime_type);
              const FileIcon = fileMeta.icon;

              return (
                <div
                  key={report.id ?? index}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Top accent bar */}
                  <div className="from-green to-green-light h-1.5 bg-linear-to-r" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <span className="text-green rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                      {report.project_code || "N/A"}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {formatDate(report.report_date)}
                    </span>
                  </div>

                  {/* Project Name */}
                  <h2 className="font-heading px-5 pb-1 text-[15px] leading-snug font-bold text-black">
                    {report.project_name || "Untitled Project"}
                  </h2>

                  {/* File attachment row */}
                  <div className="px-5 pb-3">
                    <div
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${fileMeta.bg}`}
                    >
                      <FileIcon size={14} className={fileMeta.color} />
                      <p
                        className="min-w-0 flex-1 truncate text-[12px] font-medium text-gray-700"
                        title={report.file_original_name}
                      >
                        {report.file_original_name ?? "Attached file"}
                      </p>
                      <span
                        className={`shrink-0 text-[10px] font-bold tracking-widest uppercase ${fileMeta.color}`}
                      >
                        {fileMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Notes (optional) */}
                  {report.notes && (
                    <p className="line-clamp-2 px-5 pb-3 text-[13px] leading-relaxed text-gray-500">
                      {report.notes}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-3 px-5 pb-4">
                    <MetaItem
                      icon={<CalendarDays size={13} />}
                      label="Start Date"
                      value={formatDate(report.start_date)}
                    />
                    <MetaItem
                      icon={<CalendarDays size={13} />}
                      label="End Date"
                      value={formatDate(report.end_date)}
                    />
                    <MetaItem
                      icon={<MapPin size={13} />}
                      label="Location"
                      value={report.location || "—"}
                      fullWidth
                    />
                  </div>

                  {/* Divider */}
                  <div className="mx-5 h-px bg-gray-100" />

                  {/* Card Footer */}
                  <div className="mt-auto flex items-center gap-2 px-5 py-3.5">
                    <button
                      onClick={() => handleFileAction(report)}
                      className="text-dark flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-semibold transition-colors hover:bg-gray-50"
                    >
                      {report.file_mime_type === "application/pdf" ? (
                        <>
                          <Eye size={13} />
                          View File
                        </>
                      ) : (
                        <>
                          <Download size={13} />
                          Download File
                        </>
                      )}
                    </button>

                    {user?.data?.id === report.prepared_by && (
                      <>
                        <button
                          onClick={() => setEditReport(report)}
                          className="bg-green/10 hover:bg-green/20 text-green flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                          title="Edit report"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteReport(report)}
                          className="text-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 transition-colors hover:bg-red-100"
                          title="Delete report"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && reports.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onChange={handlePageChange}
            tableName="reports"
          />
        )}
      </div>

      {editReport && (
        <EditModal report={editReport} onClose={() => setEditReport(null)} />
      )}
      {deleteReport && (
        <DeleteModal
          report={deleteReport}
          onClose={() => setDeleteReport(null)}
        />
      )}
    </div>
  );
}
