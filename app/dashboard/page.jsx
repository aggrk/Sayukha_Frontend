// app/dashboard/page.jsx
"use client";

import { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardContent from "../../components/dashboard/DashboardContent";
import ReportsPage from "../../components/dashboard/reports/ReportsPage";
import ExpensesPage from "../../components/dashboard/expenses/ExpensesPage";
import UserOnly from "../../auth/UserOnly";
import Header from "../../components/dashboard/Header";
import ProjectsPage from "../../components/dashboard/projects/ProjectsPage";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard":
        return <DashboardContent />;
      case "Reports":
        return <ReportsPage />;
      case "Expenses":
        return <ExpensesPage />;
      case "Projects":
        return <ProjectsPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <UserOnly>
      <div
        className="flex h-screen overflow-hidden"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header activeNav={activeNav} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </UserOnly>
  );
}
