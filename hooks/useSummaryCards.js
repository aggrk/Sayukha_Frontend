"use client";
import useFetch from "./useFetch";
import { CalendarDays, Users } from "lucide-react";

export default function useSummaryCards() {
  const { data: employees } = useFetch("employees", "/users");
  const { data: comparisonData, isLoading } = useFetch(
    "expense-comparison",
    "/expenses/statsComparison",
  );

  const dayTotal = comparisonData?.data?.day?.current ?? 0;
  const weekTotal = comparisonData?.data?.week?.current ?? 0;
  const monthTotal = comparisonData?.data?.month?.current ?? 0;

  const dayChange = comparisonData?.data?.day?.change ?? 0;
  const weekChange = comparisonData?.data?.week?.change ?? 0;
  const monthChange = comparisonData?.data?.month?.change ?? 0;

  const formatTrend = (change) => (change >= 0 ? `+${change}%` : `${change}%`);
  const formatTrendLabel = (change, label) => {
    if (change > 0) return `vs ${label}, spending is ${change}% higher`;
    if (change < 0)
      return `vs ${label}, spending is ${Math.abs(change)}% lower`;
    return `vs ${label}, no change`;
  };

  const summaryCards = [
    {
      label: "Daily Expense",
      value: Math.round(dayTotal),
      icon: <CalendarDays />,
      trend: formatTrend(dayChange),
      trendLabel: formatTrendLabel(dayChange, "yesterday"),
      description: "Avg. operational spend",
    },
    {
      label: "Weekly Expense",
      value: Math.round(weekTotal),
      icon: <CalendarDays />,
      trend: formatTrend(weekChange),
      trendLabel: formatTrendLabel(weekChange, "last week"),
      description: "7-day total outflows",
    },
    {
      label: "Monthly Expense",
      value: Math.round(monthTotal),
      icon: <CalendarDays />,
      trend: formatTrend(monthChange),
      trendLabel: formatTrendLabel(monthChange, "last month"),
      description: "30-day aggregated cost",
    },
    {
      label: "Total Employees",
      value: employees?.results,
      icon: <Users />,
      trend: null,
      trendLabel: null,
      description: "Across all departments",
    },
  ];

  return { summaryCards, isLoading };
}
