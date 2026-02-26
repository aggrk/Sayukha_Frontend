import { chartColors } from "../../../lib/data";

export default function LegendStats({ chartData }) {
  return (
    <div className="border-gray-low-soft grid grid-cols-2 gap-4 border-t px-7 py-5 sm:grid-cols-4">
      {chartData.map((item, i) => (
        <div key={item.category_name} className="group flex items-center gap-3">
          <div
            className="h-10 w-1 shrink-0 rounded-full transition-all duration-300 group-hover:h-12"
            style={{ backgroundColor: chartColors[i % chartColors.length] }}
          />
          <div>
            <p className="text-[11px] font-medium text-gray-400 capitalize">
              {item.category_name}
            </p>
            <p className="font-heading mt-0.5 text-sm font-bold text-gray-800">
              {Number(item.total_amount).toLocaleString()} TSH
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
