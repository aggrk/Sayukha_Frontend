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
import User from "../../components/dashboard/user/User";
import { useAuth } from "../../hooks/useAuth";
import SalaryPayments from "../../components/dashboard/salary/SalaryPayments";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const renderContentAdmin = () => {
    switch (activeNav) {
      case "Dashboard":
        return <DashboardContent />;
      case "Reports":
        return <ReportsPage />;
      case "Expenses":
        return <ExpensesPage />;
      case "Projects":
        return <ProjectsPage />;
      case "Salary Payments":
        return <SalaryPayments />;
      default:
        return <DashboardContent />;
    }
  };

  const renderContentUser = () => {
    switch (activeNav) {
      case "Dashboard":
        return <User />;
      case "Reports":
        return <ReportsPage />;
      case "Projects":
        return <ProjectsPage />;
      default:
        return <User />;
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
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header activeNav={activeNav} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {user?.data?.role === "admin"
              ? renderContentAdmin()
              : renderContentUser()}
          </main>
        </div>
      </div>
    </UserOnly>
  );
}
