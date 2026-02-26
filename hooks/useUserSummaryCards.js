"use client";

import { BrickWall, Receipt } from "lucide-react";
import { useAuth } from "./useAuth";
import useFetch from "./useFetch";

export default function useUserSummaryCards() {
  const { user } = useAuth();
  const userId = user?.data?.id;
  console.log(user);

  const { data: userReports } = useFetch("user-reports", "/reports/myReports", {
    prepared_by: userId,
  });
  const { data: userProjects } = useFetch("projects", "/projects/myProjects", {
    prepared_by: userId,
  });
  const { data: userExpenses, isLoading } = useFetch(
    "user-expenses",
    "/expenses/myExpense",
    { paid_by: userId },
  );

  console.log(userExpenses);

  const expenseCount = userExpenses?.results ?? 0;
  const reportCount = userReports?.results ?? 0;
  const projectCount = userProjects?.results ?? 0;

  const userSummaryCards = [
    {
      label: "My Expense",
      value: isLoading ? "—" : expenseCount,
      icon: <Receipt size={22} />,
      description: "Total expenses submitted by you",
    },
    {
      label: "My Reports",
      value: isLoading ? "—" : reportCount,
      icon: <BrickWall size={22} />,
      description: "Total reports you submitted",
    },
    {
      label: "My Projects",
      value: isLoading ? "—" : projectCount,
      icon: <BrickWall size={22} />,
      description: "Total projects you are supervising",
    },
  ];

  return { userSummaryCards, isLoading };
}
