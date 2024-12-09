export interface SimulationState {
  susceptible: number;
  exposed: number;
  infected: number;
  recovered: number;
  hospitalized: number;
  tested: number;
  day: number;
  firstDetectionDay: number | null;
  tenthDetectionDay: number | null;
}

export interface SimulationParams {
  totalPopulation: number;
  initialInfected: number;
  transmissionProbability: number;
  baseContactRate: number;
  contactRateVariability: number;
  infectiousPeriod: number;
  incubationPeriod: number;
  healthcareSeekingRate: number;
  testingRate: number;
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
