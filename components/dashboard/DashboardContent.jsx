"use client";
import useSummaryCards from "../../hooks/useSummaryCards";
import ChartSection from "./chart/ChartSection";
import EmployeeTable from "./employees/EmployeeTable";
import SummaryCard from "../../components/dashboard/SummaryCard";

export default function DashboardContent() {
  const { summaryCards, isLoading } = useSummaryCards();
  return (
    <div className="mx-auto max-w-400 space-y-7">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
