"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import UserOnly from "../../auth/UserOnly";

export default function DashboardLayout({ children }) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UserOnly>
      <div
        className="flex h-screen overflow-hidden"
        style={{ backgroundColor: "#f0f2f5" }}
      >
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header activeNav={activeNav} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </UserOnly>
  );
}
