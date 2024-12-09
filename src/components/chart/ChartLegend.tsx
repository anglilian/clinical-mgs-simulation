import React from 'react';

interface ChartLegendProps {
  completedRuns: number;
}

export function ChartLegend({ completedRuns }: ChartLegendProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Average Number of Infected Cases (from {completedRuns} runs)
      </h3>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm text-gray-600">Avg. Infected</span>
      </div>
    </div>
  );
}