"use client";
import useSummaryCards from "../../hooks/useSummaryCards";
import ChartSection from "../../components/dashboard/ChartSection";
import EmployeeTable from "./employees/EmployeeTable";
import SummaryCard from "../../components/dashboard/SummaryCard";

export default function DashboardContent() {
  const { summaryCards, isLoading } = useSummaryCards();
  return (
    <div className="space-y-7 max-w-400 mx-auto">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Chart ── */}
      <ChartSection />

      {/* ── Table ── */}
      <EmployeeTable />
    </div>
  );
}
