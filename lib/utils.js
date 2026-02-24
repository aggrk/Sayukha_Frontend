export const apiUrl = "http://localhost:8000/api/v1";
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
