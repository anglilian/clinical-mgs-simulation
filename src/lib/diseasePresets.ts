import { DiseasePreset } from "./types";

export const diseasePresets: DiseasePreset[] = [
  {
    name: "SARS-CoV-2 (Wild-type)",
    r0: 2.5,
    incubationPeriod: 6.67,
    infectiousPeriod: 8.0,
    firstDetectionDay: 14,
  },
  {
    name: "SARS-CoV-2 (Omicron)",
    r0: 9.5,
    incubationPeriod: 4.0,
    infectiousPeriod: 8.0,
  },
  {
    name: "SARS",
    r0: 2.4,
    incubationPeriod: 4.0,
    infectiousPeriod: 10.0,
  },
  {
    name: "Seasonal Influenza",
    r0: 2.0,
    incubationPeriod: 2.0,
    infectiousPeriod: 4.0,
  },
  {
    name: "1918 Influenza",
    r0: 0.5,
    incubationPeriod: 2.0,
    infectiousPeriod: 4.0,
  },
];
