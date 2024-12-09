export interface SimulationState {
  susceptible: number;
  exposed: number;
  infected: number;
  recovered: number;
  hospitalized: number;
  tested: number;
  detectedCases: number;
  day: number;
  firstDetectionDay: number | null;
  tenthDetectionDay: number | null;
}

export interface SimulationParams {
  totalPopulation: number;
  beta: number;
  sigma: number;
  gamma: number;
  healthcareSeekingRate: number;
  testingRate: number;
  testSpecificity: number;
  timeStep: number;
}

export interface AggregatedState {
  avgInfected: number;
  day: number;
}

export interface SimulationResults {
  aggregatedData: AggregatedState[];
  avgFirstDetectionDay: number;
  avgTenthDetectionDay: number;
  completedRuns: number;
}