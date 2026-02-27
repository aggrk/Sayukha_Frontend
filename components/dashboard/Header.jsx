"use client";

import { useState, useRef, useEffect } from "react";
import { theme } from "../../lib/data";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import useFetch from "../../hooks/useFetch";

export default function Header({ activeNav, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropRef = useRef(null);
  const { user, logout } = useAuth();
  const { name, email, role } = user?.data;
  const { data: unreadCount } = useFetch(
    "notifications-unread-count",
    "/notifications/unread-count",
  );

  // The actual number from the API response
  const count = unreadCount?.data?.unread_count ?? 0;

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
          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu />
        </button>

        {/* Page Title + Subtitle */}
        <div className="hidden lg:block">
          <h1
            className="text-xl leading-tight font-semibold text-gray-900"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {activeNav}
          </h1>
          <p className="mt-0.5 text-xs text-gray-400">
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
        <div className="hidden max-w-md flex-1 sm:block lg:ml-8">
          <div
            className="relative flex items-center rounded-xl border transition-all duration-200"
            style={{
              borderColor: searchFocused ? theme.green : theme.graySoft,
              backgroundColor: searchFocused ? "#fff" : theme.grayLight,
              boxShadow: searchFocused ? `0 0 0 3px ${theme.green}18` : "none",
            }}
          >
            <span className="pointer-events-none absolute left-3.5 text-gray-400">
              <Search />
            </span>
            <input
              type="text"
              placeholder="Search employees, expenses…"
              className="w-full bg-transparent py-2.5 pr-4 pl-10 text-sm text-gray-700 placeholder-gray-400 outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-2">
          {/* Date badge (desktop) */}
          <span
            className="mr-2 hidden rounded-lg border px-3 py-1.5 text-xs text-gray-400 xl:block"
            style={{
              borderColor: theme.graySoft,
              backgroundColor: theme.grayLight,
            }}
          >
            {today}
          </span>

          {/* Notification Bell */}
          <Link
            href="/dashboard/notifications"
            className="relative rounded-xl p-2.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Notifications"
          >
            <Bell />
            {/* Only render the dot when there are unread notifications */}
            {count > 0 && (
              <span
                className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white"
                style={{ backgroundColor: theme.red }}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div
            className="mx-1 h-8 w-px"
            style={{ backgroundColor: theme.graySoft }}
          />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-gray-100"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%)`,
                }}
              >
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm leading-tight font-semibold text-gray-800">
                  {name}
                </p>
                <p className="text-[10px] text-gray-400">{role}</p>
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
                className="absolute top-[calc(100%+8px)] right-0 z-50 w-52 overflow-hidden rounded-2xl border bg-white shadow-xl"
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
                    {
                      label: "My Profile",
                      icon: <User />,
                      link: "/dashboard/profile",
                    },
                    {
                      label: "Settings",
                      icon: <Settings />,
                      link: "/dashboard/settings",
                    },
                  ].map((item) => (
                    <Link
                      href={item.link}
                      key={item.label}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Logout */}
                <div
                  className="p-2"
                  style={{ borderTop: `1px solid ${theme.graySoft}` }}
                >
                  <button
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all hover:opacity-90"
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
            className="hover:bg-red bg-red-dark hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97] lg:flex"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
