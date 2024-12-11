import { ScaleFunction } from "./ChartUtils";
import { DiseasePreset } from "../../lib/types";

interface DetectionMarkersProps {
  xScale: ScaleFunction;
  height: number;
  padding: number;
  firstDetectionDay: number;
  tenthDetectionDay: number;
  firstDetectionDayCI: [number, number];
  tenthDetectionDayCI: [number, number];
  disease: DiseasePreset;
}

export function DetectionMarkers({
  xScale,
  height,
  padding,
  firstDetectionDay,
  tenthDetectionDay,
  disease,
}: DetectionMarkersProps) {
  return (
    <>
      {/* COVID-19 Detection marker */}
      {disease.firstDetectionDay && (
        <g>
          <line
            x1={xScale(disease.firstDetectionDay)}
            y1={padding}
            x2={xScale(disease.firstDetectionDay)}
            y2={height - padding}
            stroke="#dc2626"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <text
            x={xScale(disease.firstDetectionDay)}
            y={padding - 10}
            textAnchor="middle"
            className="text-sm fill-red-600 font-medium"
          >
            {disease.name} Detected
          </text>
        </g>
      )}
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
