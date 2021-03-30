export default function isVotingPeriod() {
  const now = new Date();
  return this.start < now && this.end > now;
}
