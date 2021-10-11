export default function gradYearIsValid(gradYear) {
  return (
    gradYear &&
    gradYear > 1000 &&
    gradYear < 20000 &&
    String(gradYear).match(/^\d+$/)
  );
}
