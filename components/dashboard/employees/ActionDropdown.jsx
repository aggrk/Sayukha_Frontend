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
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:bg-gray-50 active:scale-95 border-gray-low-soft text-[#6b7280]"
      >
        More
        <ChevronDown
          size={13}
          className={`duration-200 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+6px)] border-[#e5e7eb] w-56 rounded-2xl shadow-xl border z-20 overflow-hidden bg-white">
          <p className="px-4 py-2.5 text-[10px] border-[#f3f4f6] font-bold uppercase tracking-widest text-gray-400 border-b">
            Salary Actions
          </p>
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                onSelectAction(action.type);
                onClose();
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors group"
            >
              <span className="mt-0.5 group-hover:scale-110 transition-transform text-green">
                {action.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {action.label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
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
