"use client";

import { Banknote, ChevronDown, Wallet } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ActionDropdown({
  employee,
  isOpen,
  onToggle,
  onClose,
  onSelectAction,
}) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) return;
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  const actions = [
    {
      label: "Pay Advance Salary",
      desc: "Partial early payment",
      icon: <Wallet size={14} />,
      type: "advance",
    },
    {
      label: "Pay Full Salary",
      desc: "Complete month payment",
      icon: <Banknote size={14} />,
      type: "full",
    },
  ];

  if (employee.status !== "active") return;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="border-gray-low-soft flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition-all hover:bg-gray-50 active:scale-95"
      >
        More
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] right-0 z-20 w-56 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xl">
          <p className="border-b border-[#f3f4f6] px-4 py-2.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Salary Actions
          </p>
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                onSelectAction(action.type);
                onClose();
              }}
              className="group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-green mt-0.5 transition-transform group-hover:scale-110">
                {action.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {action.label}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {action.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
