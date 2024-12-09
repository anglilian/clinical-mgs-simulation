import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { SimulationParams, SimulationResults } from './lib/types';
import { runMonteCarloSimulation } from './lib/monteCarloSimulation';
import { SimulationChart } from './components/SimulationChart';
import { ModelAssumptions } from './components/ModelAssumptions';

const defaultParams: SimulationParams = {
  totalPopulation: 10000,
  beta: 0.3,
  sigma: 1/5.2,  // ~5.2 days incubation period
  gamma: 1/7,    // ~7 days infectious period
  healthcareSeekingRate: 0.5,
  testingRate: 0.8,
  testSpecificity: 0.85,
  timeStep: 1,   // 1 day
};

function App() {
  const [params] = useState<SimulationParams>(defaultParams);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleStartSimulation = () => {
    setIsRunning(true);
    setResults(null);
    runMonteCarloSimulation(params, 100, (newResults) => {
      setResults(newResults);
      if (newResults.completedRuns === 100) {
        setIsRunning(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Monte Carlo SEIR Disease Spread Simulation
            </h1>
          </div>
          
          <div className="mb-6">
            <button
              onClick={handleStartSimulation}
              disabled={isRunning}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRunning 
                ? `Running... (${results?.completedRuns || 0}/100)` 
                : 'Start Monte Carlo Simulation'}
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