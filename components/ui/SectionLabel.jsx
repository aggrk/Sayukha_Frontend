export function SectionLabel({ text, accentColor = "red" }) {
  const lineColor = accentColor === "green" ? "bg-green" : "bg-red";
  const textColor = accentColor === "green" ? "text-green" : "text-red";

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`block w-8 h-0.5 ${lineColor}`} />
      <span
        className={`font-condensed text-xs font-bold tracking-[0.25em] uppercase ${textColor}`}
      >
        {text}
      </span>
    </div>
  );
}
