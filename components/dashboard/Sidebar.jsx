// ─── sidebar.jsx ──────────────────────────────────────────────────────────────
"use client";

import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../lib/data";
import { LayoutDashboard, FileText, Receipt, X } from "lucide-react";

const navLinks = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Reports", icon: <FileText size={18} /> },
  { label: "Expenses", icon: <Receipt size={18} /> },
];

export default function Sidebar({
  activeNav,
  setActiveNav,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { user } = useAuth();
  const { name, role } = user?.data;

  return (
    <>
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-20 lg:hidden bg-black/50 backdrop-blur-sm transition-opacity duration-300
          ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col w-68 border-r
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto lg:shrink-0`}
        style={{
          backgroundColor: theme.dark,
          borderColor: "rgba(255,255,255,0.06)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3.5 px-6 pt-8 pb-7"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
              boxShadow: `0 4px 16px ${theme.green}50`,
            }}
          >
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-base leading-tight tracking-wide">
              Sayukha
            </p>
            <p className="text-white/30 text-[10px] font-medium mt-0.5 tracking-widest uppercase">
              Constrution LTD
            </p>
          </div>
          <button
            className="lg:hidden text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
            Main Menu
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = activeNav === link.label;
            return (
              <button
                key={link.label}
                onClick={() => {
                  setActiveNav(link.label);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive ? "text-white shadow-lg" : "text-white/45 hover:text-white/90 hover:bg-white/5"}`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${theme.green}f0 0%, ${theme.greenLight}e0 100%)`,
                        boxShadow: `0 4px 20px ${theme.green}45`,
                      }
                    : {}
                }
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
                  />
                )}
                <span
                  className={`transition-transform duration-200 ${!isActive && "group-hover:scale-110"}`}
                >
                  {link.icon}
                </span>
                <span className="flex-1 text-left">{link.label}</span>
              </button>
            );
          })}
        </nav>

        <div
          className="mx-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        />

        {/* User Card */}
        <div className="px-4 py-5">
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
              }}
            >
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/80 text-xs font-semibold truncate">
                {name}
              </p>
              <p className="text-white/30 text-[10px] truncate">{role}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50" />
          </div>
        </div>
      </aside>
    </>
  );
}
