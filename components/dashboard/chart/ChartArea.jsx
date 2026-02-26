import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays } from "lucide-react";
import CustomTooltip from "./CustomTooltip";
import { chartColors } from "../../../lib/data";

export default function ChartArea({ isLoading, chartData }) {
  return (
    <div className="min-h-72.5 px-7 pt-6 pb-2">
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="font-body text-sm text-gray-400">Loading chart...</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <CalendarDays size={32} className="text-gray-300" />
          <p className="font-body text-sm text-gray-400">
            No expense data for this period
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            barSize={48}
            margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 4"
              stroke="var(--color-gray-low-soft)"
              vertical={false}
            />
            <XAxis
              dataKey="category_name"
              tick={{
                fontSize: 12,
                fill: "#9ca3af",
                fontFamily: "'Inter', sans-serif",
              }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{
                fontSize: 11,
                fill: "#9ca3af",
                fontFamily: "'Inter', sans-serif",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.03)", rx: 6 }}
            />
            <Bar dataKey="total_amount" radius={[8, 8, 2, 2]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
