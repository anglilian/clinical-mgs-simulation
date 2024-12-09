import React from 'react';

interface ChartAxisProps {
  width: number;
  height: number;
  padding: number;
  maxValue: number;
  yScale: (value: number) => number;
  dataLength: number;
}

export function ChartAxis({ width, height, padding, maxValue, yScale, dataLength }: ChartAxisProps) {
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map((percent) => ({
    y: yScale(maxValue * percent),
    value: Math.round(maxValue * percent),
  }));

  return (
    <>
      {/* Y-axis line */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Y-axis grid lines and labels */}
      {yAxisTicks.map(({ y, value }, index) => (
        <g key={`y-axis-${index}`}>
          <line
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <text
            x={padding - 10}
            y={y}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-xs fill-gray-500"
          >
            {value}
          </text>
        </g>
      ))}

      {/* X-axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* X-axis labels */}
      <text
        x={padding}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-xs fill-gray-500"
      >
        Day 0
      </text>
      <text
        x={width - padding}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-xs fill-gray-500"
      >
        Day {dataLength - 1}
      </text>
    </>
  );
}