// Knuth's algorithm for Poisson distribution
export function poissonRandom(lambda: number): number {
  if (lambda <= 0) return 0;

  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

export function binomialRandom(n: number, p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return n;

  let count = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) count++;
  }
  return count;
}

// Box-Muller transform for normal distribution
export function normalRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return Math.max(0, mean + z0 * stdDev);
}

export function calculateConfidenceInterval(
  values: number[]
): [number, number] {
  if (values.length === 0) return [0, 0];

  const mean = values.reduce((a, b) => a + b) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) /
      (values.length - 1)
  );

  // 95% CI = mean ± (1.96 * SE), where SE = stdDev/sqrt(n)
  const standardError = stdDev / Math.sqrt(values.length);
  const margin = 1.96 * standardError;

  return [Math.max(0, mean - margin), mean + margin];
}
