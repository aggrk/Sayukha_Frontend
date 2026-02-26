"use client";

import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../lib/data";
import { LayoutDashboard, FileText, Receipt, X, BrickWall } from "lucide-react";

const navLinksAdmin = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Reports", icon: <FileText size={18} /> },
  { label: "Expenses", icon: <Receipt size={18} /> },
  { label: "Projects", icon: <BrickWall size={18} /> },
];

const navLinksUser = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Reports", icon: <FileText size={18} /> },
  { label: "Projects", icon: <BrickWall size={18} /> },
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
        className={`fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        className={`fixed top-0 left-0 z-30 flex h-full w-68 flex-col border-r transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-auto lg:shrink-0 lg:translate-x-0`}
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
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold tracking-wide text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
              boxShadow: `0 4px 16px ${theme.green}50`,
            }}
          >
            S
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base leading-tight font-semibold tracking-wide text-white">
              Sayukha
            </p>
            <p className="mt-0.5 text-[10px] font-medium tracking-widest text-white/30 uppercase">
              Constrution LTD
            </p>
          </div>
          <button
            className="rounded-lg p-1 text-white/30 transition-colors hover:bg-white/5 hover:text-white/70 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-white/25 uppercase">
            Main Menu
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {role === "admin"
            ? navLinksAdmin.map((link) => {
                const isActive = activeNav === link.label;
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      setActiveNav(link.label);
                      setSidebarOpen(false);
                    }}
                    className={`group relative flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "text-white shadow-lg" : "text-white/45 hover:bg-white/5 hover:text-white/90"}`}
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
                        className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full"
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
              })
            : navLinksUser.map((link) => {
                const isActive = activeNav === link.label;
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      setActiveNav(link.label);
                      setSidebarOpen(false);
                    }}
                    className={`group relative flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "text-white shadow-lg" : "text-white/45 hover:bg-white/5 hover:text-white/90"}`}
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
                        className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full"
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
            className="flex items-center gap-3 rounded-xl px-3 py-3"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
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
              <p className="truncate text-xs font-semibold text-white/80">
                {name}
              </p>
              <p className="truncate text-[10px] text-white/30">{role}</p>
            </div>
            <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          </div>
        </div>
      </aside>
    </>
  );
}
