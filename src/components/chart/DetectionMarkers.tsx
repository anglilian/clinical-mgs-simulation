import { ScaleFunction } from "./ChartUtils";

interface DetectionMarkersProps {
  xScale: ScaleFunction;
  height: number;
  padding: number;
  firstDetectionDay: number;
  tenthDetectionDay: number;
}

export function DetectionMarkers({
  xScale,
  height,
  padding,
  firstDetectionDay,
  tenthDetectionDay,
}: DetectionMarkersProps) {
  return (
    <>
      {/* First detection marker */}
      <g>
        <line
          x1={xScale(firstDetectionDay)}
          y1={padding}
          x2={xScale(firstDetectionDay)}
          y2={height - padding}
          stroke="#22c55e"
          strokeWidth="1"
          strokeDasharray="4"
        />
        <text
          x={xScale(firstDetectionDay)}
          y={padding - 10}
          textAnchor="middle"
          className="text-sm fill-green-600 font-medium"
        >
          First Case
        </text>
      </g>

      {/* Tenth detection marker */}
      <g>
        <line
          x1={xScale(tenthDetectionDay)}
          y1={padding}
          x2={xScale(tenthDetectionDay)}
          y2={height - padding}
          stroke="#eab308"
          strokeWidth="1"
          strokeDasharray="4"
        />
        <text
          x={xScale(tenthDetectionDay)}
          y={padding - 10}
          textAnchor="middle"
          className="text-sm fill-yellow-600 font-medium"
        >
          Tenth Case
        </text>
      </g>
    </>
  );
}
