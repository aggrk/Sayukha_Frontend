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
} from "lucide-react";
import EditModal from "./EditModal";
import MetaItem from "../../ui/MetaItems";
import DeleteModal from "./DeleteModal";

export default function ReportPage() {
  const [editReport, setEditReport] = useState(null);
  const [deleteReport, setDeleteReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: reportsData,
    isLoading,
    isError,
  } = useFetch("reports", "/reports", {
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

  const handleExportWord = async (report) => {
    try {
      const response = await api.get(
        `/reports/export/report-word/${report.id}`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `report-${report.project_code || report.id}.docx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export report:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-light px-4 py-8 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black leading-tight font-heading">
              Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Project reports and summaries
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-sm py-16">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-green rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading reports…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl py-16">
            <p className="text-sm font-medium text-red">
              Failed to load reports. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && reports.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-sm py-16">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <FileText size={22} className="text-green" />
            </div>
            <p className="text-sm text-gray-400">No reports available.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline"
            >
              <Plus size={14} /> Add your first report
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && !isError && reports.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reports.map((report, index) => (
              <div
                key={report.id ?? index}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Top accent bar */}
                <div className="h-1.5 bg-linear-to-r from-green to-green-light" />

                {/* Card Header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                  <span className="bg-green-50 text-green border border-green-200 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                    {report.project_code || "N/A"}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {formatDate(report.report_date)}
                  </span>
                </div>

                {/* Project Name */}
                <h2 className="px-5 pb-1 text-[15px] font-bold text-black leading-snug font-heading">
                  {report.project_name || "Untitled Project"}
                </h2>

                {/* Summary */}
                {report.report_summary && (
                  <p className="px-5 pb-3 text-[13px] text-gray-500 leading-relaxed line-clamp-3">
                    {report.report_summary}
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
                <div className="h-px bg-gray-100 mx-5" />

                {/* Card Footer */}
                <div className="flex items-center gap-2 px-5 py-3.5 mt-auto">
                  <button
                    onClick={() => handleExportWord(report)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer text-dark border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={13} />
                    Export Word
                  </button>
                  <button
                    onClick={() => setEditReport(report)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-green/10 hover:bg-green/20 cursor-pointer text-green transition-colors"
                    title="Edit report"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteReport(report)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-red cursor-pointer transition-colors"
                    title="Delete report"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && reports.length > 0 && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onChange={handlePageChange}
              tableName="reports"
            />
          </>
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
