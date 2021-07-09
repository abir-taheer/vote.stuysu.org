export default (vote) => {
  if (vote.choices) {
    return "RunoffVote";
  }

  if (vote.choice) {
    return "PluralityVote";
  }
};
