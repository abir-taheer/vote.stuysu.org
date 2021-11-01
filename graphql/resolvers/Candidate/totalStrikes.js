export default (candidate) =>
  candidate.strikes.reduce((a, b) => a + b.weight, 0);
