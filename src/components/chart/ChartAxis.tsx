interface ChartAxisProps {
  width: number;
  height: number;
  padding: number;
  maxValue: number;
  yScale: (value: number) => number;
  dataLength: number;
}

export function ChartAxis({
  width,
  height,
  padding,
  maxValue,
  yScale,
  dataLength,
  avgFirstDetectionDay,
  avgTenthDetectionDay,
  xScale,
}: ChartAxisProps & {
  avgFirstDetectionDay: number;
  avgTenthDetectionDay: number;
  xScale: (index: number) => number;
}) {
  const generateNiceTicks = (maxValue: number) => {
    const step = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const niceMax = Math.ceil(maxValue / step) * step;

    const ticks = [];
    for (let value = 0; value <= niceMax; value += step) {
      ticks.push({
        y: yScale(value),
        value: value,
      });
    }
    return ticks;
  };

  const yAxisTicks = generateNiceTicks(maxValue);

  return (
    <>
      {/* Y-axis line */}
      <line
        x1={padding}
        y1={height - padding}
        x2={padding}
        y2={padding}
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
            style={{
              display: y < padding || y > height - padding ? "none" : undefined,
            }}
          />
          <text
            x={padding - 10}
            y={y}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-sm fill-gray-500"
            style={{
              display: y < padding || y > height - padding ? "none" : undefined,
            }}
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
        className="text-sm fill-gray-500"
      >
        Day 0
      </text>
      <text
        x={width - padding}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-sm fill-gray-500"
      >
        Day {dataLength - 1}
      </text>

      {/* X-axis labels for average detection days */}
      <text
        x={xScale(avgFirstDetectionDay)}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-sm fill-green-600"
      >
        Day {avgFirstDetectionDay.toFixed(1)}
      </text>
      <text
        x={xScale(avgTenthDetectionDay)}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-sm fill-yellow-600"
      >
        Day {avgTenthDetectionDay.toFixed(1)}
      </text>
    </>
  );
}
