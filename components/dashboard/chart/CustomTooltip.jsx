export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-dark font-body rounded-xl border border-[rgba(255,255,255,0.1)] px-4 py-3 shadow-xl">
      <p className="mb-1 text-[10px] font-semibold tracking-widest text-white/50 uppercase">
        {label}
      </p>
      <p className="font-heading text-lg font-bold text-white">
        {Number(payload[0].value).toLocaleString()} TSH
      </p>
    </div>
  );
}
