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
  baseContactRate: number;
  contactRateVariability: number;
  healthcareSeekingRate: number;
  testingRate: number;
  timeStep: number;
  numRuns: number;
  disease: DiseasePreset;
}

export interface AggregatedState {
  avgInfected: number;
  day: number;
}

export interface SimulationResults {
  aggregatedData: AggregatedState[];
  avgFirstDetectionDay: number;
  avgTenthDetectionDay: number;
  firstDetectionDay95CI: [number, number];
  tenthDetectionDay95CI: [number, number];
  completedRuns: number;
  disease: DiseasePreset;
}

export interface DiseasePreset {
  name: string;
  r0: number;
  incubationPeriod: number;
  infectiousPeriod: number;
  firstDetectionDay?: number;
}
