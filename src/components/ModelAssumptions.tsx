import React from 'react';
import { SimulationParams } from '../lib/types';
import { Info } from 'lucide-react';

interface Props {
  params: SimulationParams;
}

export function ModelAssumptions({ params }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Model Assumptions</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Disease Parameters</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Population Size</p>
              <p className="text-sm text-gray-500">{params.totalPopulation.toLocaleString()} individuals</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Transmission Rate (β)</p>
              <p className="text-sm text-gray-500">{params.beta} per day - represents the product of contact rate and transmission probability</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Incubation Period (1/σ)</p>
              <p className="text-sm text-gray-500">{(1/params.sigma).toFixed(1)} days - time from exposure to becoming infectious</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Infectious Period (1/γ)</p>
              <p className="text-sm text-gray-500">{(1/params.gamma).toFixed(1)} days - duration of infectiousness</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Detection Parameters</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Healthcare Seeking Rate</p>
              <p className="text-sm text-gray-500">{(params.healthcareSeekingRate * 100)}% of infected individuals seek medical care</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Testing Rate</p>
              <p className="text-sm text-gray-500">{(params.testingRate * 100)}% of healthcare-seeking individuals are tested</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Test Specificity</p>
              <p className="text-sm text-gray-500">{(params.testSpecificity * 100)}% accuracy in identifying true positive cases</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-medium text-gray-700 mb-2">Simulation Method</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-500">
            <li>Uses a tau-leaping SEIR (Susceptible-Exposed-Infected-Recovered) model</li>
            <li>Transitions between states follow Poisson distributions to capture randomness</li>
            <li>Healthcare seeking and testing follow Binomial distributions</li>
            <li>Time step (τ) is {params.timeStep} day</li>
            <li>Simulation starts with one infected individual</li>
          </ul>
        </div>
      </div>
    </div>
  );
}