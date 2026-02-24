"use client";

import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import api from "../../../lib/api";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import Pagination from "../../ui/Pagination";
import { LIMIT } from "../../../lib/utils";
import ExpenseModal from "./ExpenseModal";
import DeleteModal from "./DeleteModal";

export default function ExpensesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: expenses,
    isLoading,
    isError,
  } = useFetch("expenses", "/expenses", {
    page: currentPage,
    limit: LIMIT,
  });

  const records = expenses?.data ?? [];
  const totalCount = expenses?.results ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get("/expenses/export/excel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export expenses:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-light px-4 py-8 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black leading-tight font-heading">
              Expenses
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage all recorded expenses
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-green to-green-light hover:opacity-90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-green-200 transition-all duration-200 hover:-translate-y-px whitespace-nowrap"
            >
              <Plus size={16} />
              Add Expense
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-green border border-gray-200 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-px whitespace-nowrap"
            >
              <Download size={16} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-sm py-16">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-green rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading expenses…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl py-16">
            <p className="text-sm font-medium text-red">
              Failed to load expenses. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && records.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-sm py-16">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <Download size={22} className="text-green" />
            </div>
            <p className="text-sm text-gray-400">No expenses found.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline"
            >
              <Plus size={14} /> Add your first expense
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && records.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-200 border-collapse">
              <thead>
                <tr>
                  {[
                    "Date",
                    "Description",
                    "Category",
                    "Amount",
                    "Unit",
                    "Paid By",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-white-soft border-b border-gray-100"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((expense, index) => (
                  <tr
                    key={expense.id ?? index}
                    className={`border-b border-gray-50 transition-colors duration-150 hover:bg-green-50/50 ${
                      index % 2 === 0 ? "bg-white" : "bg-white-soft"
                    }`}
                  >
                    {/* Date */}
                    <td className="px-5 py-3.5 align-middle">
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap">
                        {expense.expense_date
                          ? new Date(expense.expense_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5 align-middle max-w-55 truncate text-dark">
                      {expense.description || "—"}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 align-middle">
                      <span className="inline-block bg-green-100 text-green text-xs font-semibold px-3 py-1 rounded-full">
                        {expense.category_name || "—"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5 align-middle font-bold text-black tabular-nums">
                      {expense.amount != null
                        ? Number(expense.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })
                        : "—"}
                    </td>

                    {/* Unit */}
                    <td className="px-5 py-3.5 align-middle text-gray-500">
                      {expense.unit || "—"}
                    </td>

                    {/* Paid By */}
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {expense.paid_by_name
                            ? expense.paid_by_name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <span className="text-dark">
                          {expense.paid_by_name || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditExpense(expense)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-light/10 hover:bg-green-light/20 text-green-light transition-colors"
                          title="Edit expense"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteExpense(expense)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-red transition-colors"
                          title="Delete expense"
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

        {/* Pagination + footer */}
        {!isLoading && !isError && records.length > 0 && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onChange={handlePageChange}
              tableName="expenses"
            />
          </>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <ExpenseModal onClose={() => setShowAddModal(false)} />}
      {editExpense && (
        <ExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
        />
      )}
      {deleteExpense && (
        <DeleteModal
          expense={deleteExpense}
          onClose={() => setDeleteExpense(null)}
        />
      )}
    </div>
  );
}
