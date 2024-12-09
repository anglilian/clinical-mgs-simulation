import { SimulationState, SimulationParams } from "./types";
import { poissonRandom, binomialRandom, normalRandom } from "./poissonUtils";

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
    day: 0,
    firstDetectionDay: null,
    tenthDetectionDay: null,
  };
}

export function simulateStep(
  state: SimulationState,
  params: SimulationParams
): SimulationState {
  // Generate random contact rate for this time step
  const dailyContactRate = normalRandom(
    params.baseContactRate,
    params.contactRateVariability
  );

  // Calculate effective beta (transmission rate) for this time step
  const effectiveBeta = params.transmissionProbability * dailyContactRate;

  // Calculate lambda for new exposures using the effective beta
  const infectionLambda =
    ((effectiveBeta * state.susceptible * state.infected) /
      params.totalPopulation) *
    params.timeStep;

  // Calculate lambda for exposed becoming infected
  const exposedToInfectedLambda =
    (1 / params.incubationPeriod) * state.exposed * params.timeStep;

  // Calculate lambda for recovery
  const recoveryLambda =
    (1 / params.infectiousPeriod) * state.infected * params.timeStep;

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

  const nextState = {
    susceptible: state.susceptible - newExposed,
    exposed: state.exposed + newExposed - newInfected,
    infected: state.infected + newInfected - newRecovered,
    recovered: state.recovered + newRecovered,
    hospitalized: newHospitalized,
    tested: state.tested + newTested,
    day: state.day + 1,
    firstDetectionDay: state.firstDetectionDay,
    tenthDetectionDay: state.tenthDetectionDay,
  };

  // Update detection milestone days
  if (nextState.tested >= 1 && state.firstDetectionDay === null) {
    nextState.firstDetectionDay = nextState.day;
  }
  if (nextState.tested >= 10 && state.tenthDetectionDay === null) {
    nextState.tenthDetectionDay = nextState.day;
  }

  return nextState;
}
