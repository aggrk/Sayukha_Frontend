export default function UserSummaryCard({ label, value, icon, description }) {
  return (
    <article className="group bg-white-soft border-gray-low-soft font-body flex max-w-sm cursor-default flex-col gap-5 rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-gray-400 uppercase">
            {label}
          </p>
          <p className="font-heading text-2xl leading-none font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        {/* Icon bubble */}
        <div className="text-green bg-green/10 flex size-13 shrink-0 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
      </div>

      {/* Divider */}
      <div className="bg-gray-soft h-px" />

      {/* Bottom */}
      <div className="flex items-center justify-center">
        <p className="text-center text-[10px] leading-tight text-gray-400">
          {description}
        </p>
      </div>
    </article>
  );
}
