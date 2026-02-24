"use client";
import useFetch from "./useFetch";
import { CalendarDays, Users } from "lucide-react";

export default function useSummaryCards() {
  const { data: employees } = useFetch("employees", "/users");
  const { data: expenseDaySummary, isLoading: dayLoading } = useFetch(
    "day-expenses",
    "/expenses/dayExpenses",
  );
  const { data: expenseWeekSummary, isLoading: weekLoading } = useFetch(
    "week-expenses",
    "/expenses/weekExpenses",
  );
  const { data: expenseMonthSummary, isLoading: monthLoading } = useFetch(
    "month-expenses",
    "/expenses/monthExpenses",
  );

  const dayTotal = expenseDaySummary?.data?.[0]?.total_amount ?? 0.0;
  const weekTotal = expenseWeekSummary?.data?.[0]?.total_amount ?? 0.0;
  const monthTotal = expenseMonthSummary?.data?.[0]?.total_amount ?? 0.0;

  const isLoading = dayLoading || weekLoading || monthLoading;

  const summaryCards = [
    {
      label: "Daily Expense",
      value: Math.round(dayTotal),
      icon: <CalendarDays />,
      trend: "+4.2%",
      trendLabel: "vs yesterday",
      description: "Avg. operational spend",
    },
    {
      label: "Weekly Expense",
      value: Math.round(weekTotal),
      icon: <CalendarDays />,
      trend: "+1.8%",
      trendLabel: "vs last week",
      description: "7-day total outflows",
    },
    {
      label: "Monthly Expense",
      value: Math.round(monthTotal),
      icon: <CalendarDays />,
      trend: "-2.1%",
      trendLabel: "vs last month",
      description: "30-day aggregated cost",
    },
    {
      label: "Total Employees",
      value: employees?.results,
      icon: <Users />,
      trend: "+3 new",
      trendLabel: "this month",
      description: "Across all departments",
    },
  ];

  return { summaryCards, isLoading };
}
