import { SimulationParams } from "../lib/types";
import { Info } from "lucide-react";

interface Props {
  params: SimulationParams;
}

export function ModelAssumptions({ params }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Model Assumptions
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">
            {params.disease.name} disease characteristics
          </h3>
          <div className="space-y-2">
            <div>
              <h3>Transmission Probability</h3>
              <p className="text-sm text-gray-500">
                {((params.disease.r0 / params.baseContactRate) * 100).toFixed(
                  1
                )}
                % chance per contact
              </p>
            </div>
            <div>
              <h3>Incubation Period</h3>
              <p className="text-sm text-gray-500">
                {params.disease.incubationPeriod} days - time from exposure to
                becoming infectious
              </p>
            </div>

            <div>
              <h3>Infectious Period</h3>
              <p className="text-sm text-gray-500">
                {params.disease.infectiousPeriod} days - duration of
                infectiousness
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Detection Parameters</h3>
          <div className="space-y-2">
            <div>
              <h3>Population Size</h3>
              <p className="text-sm text-gray-500">
                {params.totalPopulation.toLocaleString()} individuals
              </p>
            </div>
            <div>
              <h3>Daily Contacts</h3>
              <p className="text-sm text-gray-500">
                {params.baseContactRate} ± {params.contactRateVariability}{" "}
                contacts per day
              </p>
            </div>
            <div>
              <h3>Healthcare Seeking Rate</h3>
              <p className="text-sm text-gray-500">
                {params.healthcareSeekingRate * 100}% of infected individuals
                seek medical care
              </p>
            </div>
            <div>
              <h3>Testing Rate</h3>
              <p className="text-sm text-gray-500">
                {(params.testingRate * 100).toFixed(0)}% of healthcare-seeking
                individuals are tested
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-medium text-gray-700 mb-2">Simulation Method</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-500">
            <li>
              Uses a tau-leaping SEIR (Susceptible-Exposed-Infected-Recovered)
              model
            </li>
            <li>
              Replicates the model in the paper{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/37367195/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                "Threat Net: A Metagenomic Surveillance Network for Biothreat
                Detection and Early Warning"
              </a>
            </li>
            <li>
              Transitions between states follow Poisson distributions to capture
              randomness
            </li>
            <li>
              Healthcare seeking and testing follow Binomial distributions
            </li>
            <li>Time step (τ) is {params.timeStep} day</li>
            <li>
              Simulation starts with {params.initialInfected} infected
              {params.initialInfected > 1 ? " individuals" : " individual"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
