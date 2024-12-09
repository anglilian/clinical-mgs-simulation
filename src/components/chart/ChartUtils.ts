import { AggregatedState } from "../../lib/types";

export type ScaleFunction = (value: number) => number;

export function createScales(
  width: number,
  height: number,
  padding: number,
  data: AggregatedState[],
  maxValue: number
) {
  const xScale = (index: number): number =>
    padding + (index / (data.length - 1)) * (width - 2 * padding);

  const yScale = (value: number): number =>
    padding + ((maxValue - value) / maxValue) * (height - 2 * padding);

  return { xScale, yScale };
}
