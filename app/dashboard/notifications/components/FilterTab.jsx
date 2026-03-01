export default function FilterTab({ label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`font-body flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-green text-white shadow-sm"
          : "text-dark hover:bg-gray-low-light"
      }`}
    >
      {label}
      {count > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${active ? "bg-white/25 text-white" : "bg-gray-low-soft text-dark"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
