import { ChevronDown } from "lucide-react";
import { theme } from "../../lib/data";
export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  limit = 10,
  onChange,
  tableName,
}) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
    )
    .reduce((acc, page, idx, arr) => {
      if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
      acc.push(page);
      return acc;
    }, []);

  return (
    <div
      className="px-7 py-4 flex items-center justify-between border-t"
      style={{ borderColor: theme.graySoft }}
    >
      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">
          {totalCount === 0 ? 0 : start}–{end}
        </span>{" "}
        of <span className="font-semibold text-gray-600">{totalCount}</span>{" "}
        {tableName}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:bg-gray-100"
          style={{ color: "#9ca3af" }}
        >
          <ChevronDown size={14} style={{ transform: "rotate(90deg)" }} />
        </button>

        {pages.map((item, idx) =>
          item === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor:
                  currentPage === item ? theme.green : "transparent",
                color: currentPage === item ? "#fff" : "#9ca3af",
                boxShadow:
                  currentPage === item ? `0 2px 8px ${theme.green}40` : "none",
              }}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:bg-gray-100"
          style={{ color: "#9ca3af" }}
        >
          <ChevronDown size={14} style={{ transform: "rotate(-90deg)" }} />
        </button>
      </div>
    </div>
  );
}
