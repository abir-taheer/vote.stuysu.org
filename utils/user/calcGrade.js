export default function calcGrade(gradYear) {
  const graduationDate = new Date(`June 28, ${gradYear}`);
  const millisecondsInAYear = 1000 * 60 * 60 * 24 * 365;
  const now = new Date();

  const millisecondsTillGraduation = graduationDate.getTime() - now.getTime();
  const seniorGrade = 12;
  let yearsLeft = Math.floor(millisecondsTillGraduation / millisecondsInAYear);

  // Cap the grade of alumni at 13
  if (yearsLeft < -1) {
    yearsLeft = -1;
  }

  if (yearsLeft > seniorGrade) {
    yearsLeft = seniorGrade;
  }

  return seniorGrade - yearsLeft;
}
