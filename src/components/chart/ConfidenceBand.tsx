interface ConfidenceBandProps {
  xScale: (index: number) => number;
  height: number;
  padding: number;
  firstDetectionDay: number;
  firstDetectionDayCI: [number, number];
  tenthDetectionDay: number;
  tenthDetectionDayCI: [number, number];
}

export function ConfidenceBand({
  xScale,
  height,
  padding,
  firstDetectionDay,
  firstDetectionDayCI,
  tenthDetectionDay,
  tenthDetectionDayCI,
}: ConfidenceBandProps) {
  return (
    <>
      {/* First detection CI band */}
      <rect
        x={xScale(firstDetectionDayCI[0])}
        y={padding}
        width={xScale(firstDetectionDayCI[1]) - xScale(firstDetectionDayCI[0])}
        height={height - 2 * padding}
        fill="#22c55e"
        fillOpacity="0.1"
      />

      {/* Tenth detection CI band */}
      <rect
        x={xScale(tenthDetectionDayCI[0])}
        y={padding}
        width={xScale(tenthDetectionDayCI[1]) - xScale(tenthDetectionDayCI[0])}
        height={height - 2 * padding}
        fill="#eab308"
        fillOpacity="0.1"
      />
    </>
  );
}
