export default function MetaItem({ icon, label, value, fullWidth = false }) {
  return (
    <div className={`flex items-start gap-2 ${fullWidth ? "col-span-2" : ""}`}>
      <div className="mt-0.5 shrink-0 text-green">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </p>
        <p className="text-[13px] font-medium text-dark mt-0.5">{value}</p>
      </div>
    </div>
  );
}
