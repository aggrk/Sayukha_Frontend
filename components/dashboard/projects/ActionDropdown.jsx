"use client";

import useFetch from "../../../hooks/useFetch";
import { ChevronDown, User } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ActionDropdown({
  project,
  isOpen,
  onToggle,
  onClose,
  onSelectEmployee,
}) {
  const ref = useRef();
  const { data: employeesData, isLoading } = useFetch(["employees"], "/users");
  const elligibleEmployees = employeesData?.data?.filter(
    (employee) =>
      employee.role === "site manager" || employee.role === "site admin",
  );

  useEffect(() => {
    if (!isOpen) return;
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  if (project.project_status !== "approved") return;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="border-gray-low-soft flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition-all hover:bg-gray-50 active:scale-95"
      >
        Choose Supervisor
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] right-0 z-20 w-56 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xl">
          <p className="border-b border-[#f3f4f6] px-4 py-2.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Elligible Employees
          </p>
          {elligibleEmployees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => {
                onSelectEmployee(employee.id);
                onClose();
              }}
              className="group flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-green mt-0.5 transition-transform group-hover:scale-110">
                <User size={14} />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {employee.name}
                </p>
                {/* <p className="mt-0.5 text-[11px] text-gray-400">
                  {action.desc}
                </p> */}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
