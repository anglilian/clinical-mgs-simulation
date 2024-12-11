interface ChartLegendProps {
  completedRuns: number;
}

export function ChartLegend({ completedRuns }: ChartLegendProps) {
  return (
    <div className="mb-4 space-y-3">
      <h3 className="text-xl font-semibold text-gray-800">
        Average Cumulative Infections (from {completedRuns} runs)
      </h3>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-base text-gray-600">Total Ever Infected</span>
      </div>
    </div>
  );
}
