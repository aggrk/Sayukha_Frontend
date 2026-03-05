"use client";

import { useCallback, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { Banknote } from "lucide-react";
import { LIMIT, formatCurrency, formatDate } from "../../../lib/utils";
import Pagination from "../../ui/Pagination";
import ActionDropdown from "../employees/ActionDropdown";
import SalaryModal from "../employees/SalaryModal";
import { useAuth } from "../../../hooks/useAuth";

function StatusBadge({ status }) {
  const map = {
    paid: "bg-green-100 text-green border-green-200",
    partial: "bg-amber-100 text-amber-700 border-amber-200",
    pending: "bg-red-100 text-red border-red-200",
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

export default function SalaryPayments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modal, setModal] = useState(null);
  const { user } = useAuth();
  const {
    data: salaryData,
    isLoading,
    isError,
  } = useFetch("salary-payments", "/salary-payments", {
    page: currentPage,
    limit: LIMIT,
  });

  const salaries = salaryData?.data ?? [];
  const totalCount = salaryData?.result ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = useCallback((id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }, []);

  return (
    <>
      {/* SalaryModal — same pattern as EmployeeTable */}
      {modal && (
        <SalaryModal
          employee={modal.employee}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}

      <div className="font-body min-h-screen py-8">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl leading-tight font-bold text-black">
                Salary Payments
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage all employee salary disbursements
              </p>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
              <div className="border-t-green h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200" />
              <p className="text-sm text-gray-400">Loading salary payments…</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16">
              <p className="text-red text-sm font-medium">
                Failed to load salary payments. Please try again.
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && salaries.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                <Banknote size={22} className="text-green" />
              </div>
              <p className="text-sm text-gray-400">No salary payments found.</p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && salaries.length > 0 && (
            <div className="w-full overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-250 border-collapse text-sm">
                <thead>
                  <tr>
                    {[
                      "Employee",
                      "Payment Month",
                      "Basic Salary",
                      "Advance",
                      "Advance Paid At",
                      "Full Payment",
                      "Full Paid At",
                      "Balance",
                      "Status",
                      "Notes",
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
                  {salaries.map((salary, index) => (
                    <tr
                      key={salary.id ?? index}
                      className={`border-b border-gray-50 transition-colors duration-150 hover:bg-green-50/40 ${
                        index % 2 === 0 ? "bg-white" : "bg-white-soft"
                      }`}
                    >
                      {/* Employee */}
                      <td className="px-5 py-4 align-middle">
                        <p className="leading-snug font-semibold text-black">
                          {salary.employee_name || "—"}
                        </p>
                        <span className="text-green mt-1 inline-block rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                          ID #{salary.employee_id ?? "N/A"}
                        </span>
                      </td>

                      {/* Payment Month */}
                      <td className="px-5 py-4 align-middle text-gray-600">
                        {formatDate(salary.payment_month)}
                      </td>

                      {/* Basic Salary */}
                      <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                        {formatCurrency(salary.basic_salary)}
                        <span className="ml-1 text-[10px] font-normal text-gray-400">
                          TSH
                        </span>
                      </td>

                      {/* Advance Amount */}
                      <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                        {formatCurrency(salary.advance_amount)}
                        <span className="ml-1 text-[10px] font-normal text-gray-400">
                          TSH
                        </span>
                      </td>

                      {/* Advance Paid At */}
                      <td className="px-5 py-4 align-middle text-xs text-gray-500">
                        {salary.advance_paid_at ? (
                          formatDate(salary.advance_paid_at)
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Full Payment Amount */}
                      <td className="px-5 py-4 align-middle font-bold whitespace-nowrap text-black tabular-nums">
                        {formatCurrency(salary.full_payment_amount)}
                        <span className="ml-1 text-[10px] font-normal text-gray-400">
                          TSH
                        </span>
                      </td>

                      {/* Full Payment Paid At */}
                      <td className="px-5 py-4 align-middle text-xs text-gray-500">
                        {salary.full_payment_paid_at ? (
                          formatDate(salary.full_payment_paid_at)
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Balance */}
                      <td className="px-5 py-4 align-middle font-bold whitespace-nowrap tabular-nums">
                        <span
                          className={
                            parseFloat(salary.balance) > 0
                              ? "text-red"
                              : "text-green"
                          }
                        >
                          {formatCurrency(salary.balance)}
                        </span>
                        <span className="ml-1 text-[10px] font-normal text-gray-400">
                          TSH
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 align-middle">
                        <StatusBadge status={salary.status} />
                      </td>

                      {/* Notes */}
                      <td className="max-w-40 truncate px-5 py-4 align-middle text-xs text-gray-400">
                        {salary.notes || "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 align-middle">
                        {user?.data?.role === "admin" && (
                          <ActionDropdown
                            employee={{
                              status:
                                salary.status === "paid"
                                  ? "inactive"
                                  : "active",
                            }}
                            isOpen={openDropdown === salary.id}
                            onToggle={() => handleToggle(salary.id)}
                            onClose={() => setOpenDropdown(null)}
                            onSelectAction={(type) =>
                              setModal({
                                employee: {
                                  id: salary.employee_id,
                                  name: salary.employee_name,
                                  basic_salary: salary.basic_salary,
                                  account_number: salary.account_number,
                                },
                                type,
                              })
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && salaries.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
