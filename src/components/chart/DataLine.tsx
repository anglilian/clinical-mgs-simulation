import { AggregatedState } from "../../lib/types";

interface DataLineProps {
  data: AggregatedState[];
  xScale: (index: number) => number;
  yScale: (value: number) => number;
}

export function DataLine({ data, xScale, yScale }: DataLineProps) {
  const points = data
    .map((d, index) => `${xScale(index)},${yScale(d.avgInfected)}`)
    .join(" ");

  return (
    <polyline
      points={points}
      fill="none"
      stroke="#ef4444"
      strokeWidth="1.5"
      vectorEffect="non-scaling-stroke"
    />
  );
}
