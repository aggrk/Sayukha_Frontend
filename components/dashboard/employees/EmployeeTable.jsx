"use client";

import { useState, useEffect, useCallback } from "react";
import useFetch from "../../../hooks/useFetch";
import Pagination from "../../ui/Pagination";
import { Edit2, Trash2, Plus, Loader2, User } from "lucide-react";
import UpdateUserModal from "./UpdateUserModal";
import DeleteUserModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";
import { LIMIT, getInitials } from "../../../lib/utils";
import SalaryModal from "./SalaryModal";
import ActionDropdown from "./ActionDropdown";

export default function EmployeeTable() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [updateEmployee, setUpdateEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: employeesData,
    isLoading,
    refetch,
  } = useFetch(["employees", currentPage], "/users", {
    page: currentPage,
    limit: LIMIT,
  });

  const employees = employeesData?.data ?? [];
  const totalCount = employeesData?.results ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const filtered =
    filterStatus === "All"
      ? employees
      : employees.filter(
          (e) => e.status?.toLowerCase() === filterStatus.toLowerCase(),
        );

  const activeCount = employees.filter(
    (e) => e.status?.toLowerCase() === "active",
  ).length;

  const handleToggle = useCallback((id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  return (
    <>
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSuccess={() => {
            refetch();
            setCurrentPage(1);
          }}
        />
      )}

      {updateEmployee && (
        <UpdateUserModal
          employee={updateEmployee}
          onClose={() => setUpdateEmployee(null)}
          onSuccess={() => {
            refetch();
            setUpdateEmployee(null);
          }}
        />
      )}

      {deleteEmployee && (
        <DeleteUserModal
          employee={deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          onSuccess={() => {
            refetch();
            setDeleteEmployee(null);
            if (filtered.length === 1 && currentPage > 1) {
              setCurrentPage((p) => p - 1);
            }
          }}
        />
      )}

      {modal && (
        <SalaryModal
          employee={modal.employee}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}

      <section className="rounded-2xl border bg-white-soft border-gray-low-soft overflow-hidden font-body shadow-sm">
        {/* Header */}
        <div className="px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-gray-low-soft border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 font-heading">
              Employee Records
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-gray-400">{totalCount} total</p>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-sm font-medium text-green">
                {activeCount} active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-xl border text-xs border-gray-low-soft bg-gray-low-light">
              {["All", "Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 cursor-pointer py-1.5 rounded-lg font-semibold transition-all duration-150 ${
                    filterStatus === s
                      ? "bg-white text-green shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                      : "bg-transparent text-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] shadow-sm bg-linear-to-br from-green to-green-light cursor-pointer"
            >
              <Plus size={15} />
              Add New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading employees...</span>
            </div>
          ) : (
            <table className="w-full min-w-175">
              <thead>
                <tr className="bg-gray-low-light">
                  {[
                    "Employee",
                    "Account No.",
                    "Position",
                    "Basic Salary / mo",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((emp, idx) => {
                  const status = emp.status?.toLowerCase();
                  // const sConfig = statusConfig[sKey] ?? statusConfig.inactive;

                  return (
                    <tr
                      key={emp.id}
                      className="border-t transition-colors hover:bg-gray-50/70 group border-gray-low-soft"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm bg-green">
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {emp.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg bg-gray-low-light text-[#6b7280]">
                          {emp.account_number ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-gray-low-light text-[#6b7280]">
                          {emp.position ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-800">
                          {Number(emp.basic_salary).toLocaleString()} TSH
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === "active" ? "bg-active-dot" : "bg-inactive-dot"}`}
                          />
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status === "active" ? "bg-[#dcfce7] text-active" : "bg-[#fee2e2] text-inactive"}`}
                          >
                            {status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setUpdateEmployee(emp)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 shadow-sm bg-linear-to-br from-green to-green-light cursor-pointer"
                          >
                            <Edit2 size={12} />
                            Update
                          </button>

                          <button
                            onClick={() => setDeleteEmployee(emp)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 shadow-sm cursor-pointer bg-linear-to-br from-red to-red-dark"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>

                          <ActionDropdown
                            employee={emp}
                            isOpen={openDropdown === emp.id}
                            onToggle={() => handleToggle(emp.id)}
                            onClose={() => setOpenDropdown(null)}
                            onSelectAction={(type) =>
                              setModal({ employee: emp, type })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-gray-low-light">
                <User size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-600">
                No employees found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try changing the filter or add a new employee
              </p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={LIMIT}
          onChange={setCurrentPage}
          tableName="employees"
        />
      </section>
    </>
  );
}
