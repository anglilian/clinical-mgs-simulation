export interface DiseasePreset {
  name: string;
  transmissionProbability: number;
  incubationPeriod: number;
  infectiousPeriod: number;
}

export const diseasePresets: DiseasePreset[] = [
  {
    name: "SARS-CoV-2 (Wild-type)",
    transmissionProbability: 0.32,
    incubationPeriod: 6.67,
    infectiousPeriod: 8.0,
  },
  {
    name: "SARS-CoV-2 (Omicron)",
    transmissionProbability: 1.19,
    incubationPeriod: 4.0,
    infectiousPeriod: 8.0,
  },
  {
    name: "SARS",
    transmissionProbability: 0.24,
    incubationPeriod: 4.0,
    infectiousPeriod: 10.0,
  },
  {
    name: "Seasonal Influenza",
    transmissionProbability: 0.33,
    incubationPeriod: 2.0,
    infectiousPeriod: 4.0,
  },
  {
    name: "1918 Influenza",
    transmissionProbability: 0.5,
    incubationPeriod: 2.0,
    infectiousPeriod: 4.0,
  },
];
