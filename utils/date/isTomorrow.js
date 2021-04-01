const oneDay = 1000 * 60 * 60 * 24;

function getMidnight(day){
    const date = new Date(day);
    date.setMilliseconds(999);
    date.setSeconds(59);
    date.setMinutes(59);
    date.setHours(23);
    return date;
}

export default function isTomorrow(date, now = new Date()){
    const midnightTonight = getMidnight(now);
    const midnightTomorrow = new Date(midnightTonight.getTime() + oneDay);

    return date > midnightTonight && date < midnightTomorrow;
}