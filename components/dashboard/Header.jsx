"use client";

import { useState, useRef, useEffect } from "react";
import { theme } from "../../lib/data";
import { useAuth } from "../../hooks/useAuth";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageCircleMore,
  Search,
  Settings,
  User,
} from "lucide-react";

export default function Header({ activeNav, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropRef = useRef(null);
  const { user, logout } = useAuth();
  const { name, email } = user?.data;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const pageDescriptions = {
    Dashboard: `Welcome back, ${name} Here's what's happening today.`,
    "Add Employee": "Fill in the form to onboard a new team member.",
    Employees: "Manage and view all team members.",
    Expenses: "Track and manage all organizational expenses.",
  };

  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={{
        backgroundColor: theme.whiteSoft,
        borderColor: theme.graySoft,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Main header row */}
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu />
        </button>

        {/* Page Title + Subtitle */}
        <div className="hidden lg:block">
          <h1
            className="text-xl font-semibold text-gray-900 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {activeNav}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {pageDescriptions[activeNav]}
          </p>
        </div>

        {/* Mobile title */}
        <h1
          className="text-base font-semibold text-gray-900 lg:hidden"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {activeNav}
        </h1>

        {/* Search */}
        <div className="flex-1 max-w-md lg:ml-8 hidden sm:block">
          <div
            className="relative flex items-center rounded-xl border transition-all duration-200"
            style={{
              borderColor: searchFocused ? theme.green : theme.graySoft,
              backgroundColor: searchFocused ? "#fff" : theme.grayLight,
              boxShadow: searchFocused ? `0 0 0 3px ${theme.green}18` : "none",
            }}
          >
            <span className="absolute left-3.5 text-gray-400 pointer-events-none">
              <Search />
            </span>
            <input
              type="text"
              placeholder="Search employees, expenses…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-2">
          {/* Date badge (desktop) */}
          <span
            className="hidden xl:block text-xs text-gray-400 px-3 py-1.5 rounded-lg border mr-2"
            style={{
              borderColor: theme.graySoft,
              backgroundColor: theme.grayLight,
            }}
          >
            {today}
          </span>

          {/* Notification Bell */}
          <button
            className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
              style={{ backgroundColor: theme.red }}
            />
          </button>

          {/* Divider */}
          <div
            className="w-px h-8 mx-1"
            style={{ backgroundColor: theme.graySoft }}
          />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
                }}
              >
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {name}
                </p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
              <span
                className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              >
                <ChevronDown />
              </span>
            </button>

            {/* Dropdown Panel */}
            {profileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl shadow-xl border overflow-hidden z-50 bg-white"
                style={{ borderColor: theme.graySoft }}
              >
                {/* Profile header */}
                <div
                  className="px-4 py-3.5"
                  style={{ borderBottom: `1px solid ${theme.graySoft}` }}
                >
                  <p className="text-sm font-semibold text-gray-800">{name}</p>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {[
                    { label: "My Profile", icon: <User /> },
                    { label: "Settings", icon: <Settings /> },
                    { label: "Help & Support", icon: <MessageCircleMore /> },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div
                  className="p-2"
                  style={{ borderTop: `1px solid ${theme.graySoft}` }}
                >
                  <button
                    className="w-full text-left cursor-pointer px-3 py-2.5 text-sm font-medium rounded-xl flex items-center gap-3 transition-all hover:opacity-90"
                    onClick={logout}
                    style={{
                      backgroundColor: `${theme.red}12`,
                      color: theme.red,
                    }}
                  >
                    <LogOut />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button (visible on desktop outside dropdown) */}
          <button
            onClick={logout}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.97] shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${theme.red} 0%, ${theme.redDark} 100%)`,
              boxShadow: `0 4px 14px ${theme.red}35`,
            }}
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
