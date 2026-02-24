import { TrendingUp } from "lucide-react";
import { theme } from "../../lib/data";
import { TrendingDown } from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
export default function SummaryCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  description,
}) {
  const isPositive = trend.startsWith("+");
  const isNeutral = !trend.includes("%");

  const trendColor = isNeutral
    ? theme.green
    : isPositive
      ? theme.green
      : theme.red;

  const trendBg = isNeutral
    ? `${theme.green}12`
    : isPositive
      ? `${theme.green}12`
      : `${theme.red}12`;

  return (
    <article
      className="rounded-2xl p-6 flex flex-col gap-5 group
        hover:-translate-y-0.5 hover:shadow-lg
        transition-all duration-300 border cursor-default"
      style={{
        backgroundColor: theme.whiteSoft,
        borderColor: theme.graySoft,
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2"
            style={{ color: "#9ca3af" }}
          >
            {label}
          </p>
          <p
            className="text-2xl font-bold leading-none tracking-tight text-gray-900"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {label.includes("Expense") ? `${value} TSH` : value}
          </p>
        </div>

        {/* Icon bubble */}
        <div
          className="w-13 h-13 shrink-0 rounded-2xl text-green flex items-center justify-center text-2xl
            transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            backgroundColor: `${theme.green}10`,
            width: "52px",
            height: "52px",
          }}
        >
          {icon}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: theme.graySoft }} />

      {/* Bottom: trend + description */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: trendBg, color: trendColor }}
          >
            {!isNeutral && (isPositive ? <TrendingUp /> : <TrendingDown />)}
            {trend}
          </span>
          <span className="text-[11px] text-gray-400">{trendLabel}</span>
        </div>

        {/* Subtle right label */}
        <p className="text-[10px] text-gray-400 text-right leading-tight hidden sm:block max-w-25">
          {description}
        </p>
      </div>
    </article>
  );
}
