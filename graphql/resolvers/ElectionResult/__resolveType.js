export default (result) => {
  if (result.rounds) {
    return "RunoffResult";
  }

  if (result.candidateResults) {
    return "PluralityResult";
  }
};
