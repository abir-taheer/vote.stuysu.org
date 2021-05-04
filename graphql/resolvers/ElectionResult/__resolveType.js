export default (result) => {
  console.log(result);

  if (result.rounds) {
    return "RunoffResult";
  }

  if (result.candidateResults) {
    return "PluralityResult";
  }
};
