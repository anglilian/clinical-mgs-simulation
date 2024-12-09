import { SimulationState, SimulationParams } from "./types";
import { poissonRandom, binomialRandom } from "./poissonUtils";

export function initializeSimulation(
  params: SimulationParams
): SimulationState {
  return {
    susceptible: params.totalPopulation - params.initialInfected,
    exposed: 0,
    infected: params.initialInfected,
    recovered: 0,
    hospitalized: 0,
    tested: 0,
    detectedCases: 0,
    day: 0,
    firstDetectionDay: null,
    tenthDetectionDay: null,
  };
}

export function simulateStep(
  state: SimulationState,
  params: SimulationParams
): SimulationState {
  // Calculate lambda for new exposures
  const infectionLambda =
    ((params.beta * state.susceptible * state.infected) /
      params.totalPopulation) *
    params.timeStep;

  // Calculate lambda for exposed becoming infected
  const exposedToInfectedLambda =
    params.sigma * state.exposed * params.timeStep;

  // Calculate lambda for recovery
  const recoveryLambda = params.gamma * state.infected * params.timeStep;

  // Generate Poisson random numbers for transitions
  const newExposed = Math.min(
    poissonRandom(infectionLambda),
    state.susceptible
  );
  const newInfected = Math.min(
    poissonRandom(exposedToInfectedLambda),
    state.exposed
  );
  const newRecovered = Math.min(poissonRandom(recoveryLambda), state.infected);

  // Calculate healthcare seeking and testing using binomial distribution
  const newHospitalized = binomialRandom(
    state.infected,
    params.healthcareSeekingRate
  );
  const newTested = binomialRandom(newHospitalized, params.testingRate);

  // Calculate true positive tests (assuming perfect sensitivity for simplicity)
  const newDetected = binomialRandom(newTested, params.testSpecificity);

  const nextState = {
    susceptible: state.susceptible - newExposed,
    exposed: state.exposed + newExposed - newInfected,
    infected: state.infected + newInfected - newRecovered,
    recovered: state.recovered + newRecovered,
    hospitalized: newHospitalized,
    tested: state.tested + newTested,
    detectedCases: state.detectedCases + newDetected,
    day: state.day + 1,
    firstDetectionDay: state.firstDetectionDay,
    tenthDetectionDay: state.tenthDetectionDay,
  };

  // Update detection milestone days
  if (nextState.detectedCases >= 1 && state.firstDetectionDay === null) {
    nextState.firstDetectionDay = nextState.day;
  }
  if (nextState.detectedCases >= 10 && state.tenthDetectionDay === null) {
    nextState.tenthDetectionDay = nextState.day;
  }

  return nextState;
}
