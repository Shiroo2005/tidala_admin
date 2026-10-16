/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
export const formatNumber = (num?: number) => {
  if (num === undefined) return "0";
  return new Intl.NumberFormat().format(num);
};

// Custom tooltips for premium feel
export const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xl">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-sm my-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-slate-600 font-medium">{p.name}:</span>
            <span className="text-slate-900 font-bold">
              {formatNumber(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: any[];
  total: number;
}

export const CustomPieTooltip = ({
  active,
  payload,
  total,
}: CustomPieTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percent = total > 0 ? ((data.value / total) * 100).toFixed(1) : "0";
    return (
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-lg text-sm">
        <span className="font-semibold text-slate-700">{data.name}:</span>{" "}
        <span className="font-bold text-slate-900">
          {formatNumber(data.value)}
        </span>{" "}
        <span className="text-slate-400 text-xs">({percent}%)</span>
      </div>
    );
  }
  return null;
};
