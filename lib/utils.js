export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const LIMIT = 10;

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export const formatCurrency = (amount) => {
  if (amount == null) return "—";
  return Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 });
};

function toYMD(date) {
  return date.toISOString().split("T")[0];
}

export function getDateRange(filter) {
  const now = new Date();

  if (filter === "Day") {
    const today = toYMD(now);
    return { gte: today, lte: today };
  }

  if (filter === "Week") {
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { gte: toYMD(monday), lte: toYMD(sunday) };
  }

  if (filter === "Month") {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { gte: toYMD(firstDay), lte: toYMD(lastDay) };
  }
}
