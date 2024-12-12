import { useState } from "react";
import { Activity } from "lucide-react";
import {
  SimulationParams,
  SimulationResults,
  DiseasePreset,
} from "./lib/types";
import { runMonteCarloSimulation } from "./lib/monteCarloSimulation";
import { SimulationChart } from "./components/SimulationChart";
import { ModelAssumptions } from "./components/ModelAssumptions";
import { DiseaseSelector } from "./components/DiseaseSelector";
import { diseasePresets } from "./lib/diseasePresets";

const defaultParams: SimulationParams = {
  totalPopulation: 1000000,
  baseContactRate: 20,
  disease: diseasePresets[0],
  contactRateVariability: 10,
  healthcareSeekingRate: 0.5,
  testingRate: 0.16,
  timeStep: 1,
  initialInfected: 10,
  numRuns: 1000,
};

function App() {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(
    diseasePresets[0].name
  );

  const handleStartSimulation = () => {
    setIsRunning(true);
    setResults(null);
    runMonteCarloSimulation(params, (newResults) => {
      setResults(newResults);
      if (newResults.completedRuns === params.numRuns) {
        setIsRunning(false);
      }
    });
  };

  const handleParamChange = (key: keyof SimulationParams, value: number) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDiseaseSelect = (preset: DiseasePreset) => {
    setSelectedDisease(preset.name);
    setParams((prev) => ({
      ...prev,
      disease: preset,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Monte Carlo SEIR Disease Spread Simulation
            </h1>
          </div>

          <div className="mb-6 space-y-6">
            <DiseaseSelector
              presets={diseasePresets}
              onSelect={handleDiseaseSelect}
              selectedDisease={selectedDisease}
            />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Healthcare Seeking Rate
                  </p>
                  <p className="text-sm text-gray-500">
                    Percentage of infected individuals who seek medical care
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={params.healthcareSeekingRate}
                  onChange={(e) =>
                    handleParamChange(
                      "healthcareSeekingRate",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900 min-w-[3ch]">
                  {(params.healthcareSeekingRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Testing Rate
                  </p>
                  <p className="text-sm text-gray-500">
                    Percentage of infected healthcare-seeking individuals tested
                    for the pathogen
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={params.testingRate}
                  onChange={(e) =>
                    handleParamChange("testingRate", parseFloat(e.target.value))
                  }
                  className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900 min-w-[3ch]">
                  {(params.testingRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <button
              onClick={handleStartSimulation}
              disabled={isRunning}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isRunning
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isRunning
                ? `Running... (${results?.completedRuns || 0}/${
                    params.numRuns
                  })`
                : "Start simulation"}
            </button>
          </div>

          {results && <SimulationChart results={results} />}
        </div>

        <ModelAssumptions params={params} />
      </div>
    </div>
  );
}

export default App;
