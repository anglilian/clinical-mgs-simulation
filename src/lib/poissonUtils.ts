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