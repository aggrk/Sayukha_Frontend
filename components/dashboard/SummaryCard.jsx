import { TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  description,
}) {
  const isPositive = trend?.startsWith("+");

  return (
    <article className="group bg-white-soft border-gray-low-soft font-body flex cursor-default flex-col gap-5 rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-gray-400 uppercase">
            {label}
          </p>
          <p className="font-heading text-2xl leading-none font-bold tracking-tight text-gray-900">
            {label.includes("Expense") ? `${value} TSH` : value}
          </p>
        </div>

        {/* Icon bubble */}
        <div className="text-green bg-green/10 flex size-13 shrink-0 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
      </div>

      {/* Divider */}
      <div className="bg-gray-soft h-px" />

      {/* Bottom: trend + description */}
      <div
        className={`flex items-center gap-2 ${trend ? "justify-between" : "justify-center"}`}
      >
        {trend && (
          <div className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${isPositive ? "text-green bg-green/12" : "text-red bg-red/12"}`}
            >
              {isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {trend}
            </span>
            <span className="text-[11px] text-gray-400">{trendLabel}</span>
          </div>
        )}
        <p
          className={`text-[10px] leading-tight text-gray-400 ${trend ? "hidden max-w-25 text-right sm:block" : "text-center"}`}
        >
          {description}
        </p>
      </div>
    </article>
  );
}
