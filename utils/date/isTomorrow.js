const oneDay = 1000 * 60 * 60 * 24;

const getMidnight = (day) => new Date(day.setHours(23, 59, 59, 999));

export default function isTomorrow(date, now = new Date()) {
  if (!date instanceof Date) {
    date = new Date(date);
  }

  const midnightTonight = getMidnight(now);
  const midnightTomorrow = new Date(midnightTonight.getTime() + oneDay);

  return date > midnightTonight && date < midnightTomorrow;
}
