import React, { useContext, useEffect, useState } from "react";
import DateContext from "../../comps/shared/DateContext";
import moment from "moment-timezone";

const oneSecond = 1000;
const thirtySeconds = oneSecond * 30;
const oneMinute = thirtySeconds * 2;

const useReadableDate = (updateLive = false, updateInterval = oneMinute) => {
  const dateContext = useContext(DateContext);
  const [now, setNow] = useState(dateContext.getNow());

  useEffect(() => {
    if (updateLive) {
      const timeout = setTimeout(
        () => setNow(dateContext.getNow()),
        updateInterval
      );

      // Prevent memory leaks by clearing the timeout when the hook unmounts
      return () => clearTimeout(timeout);
    }
  });

  function getReadableDate(rawDate) {
    // Create a date object in case not already
    const date = new Date(rawDate);

    const momentDate = moment(date).tz(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    return momentDate.calendar(null, {
      sameDay: "[Today at] LT z",
      nextDay: "[Tomorrow at] LT z",
      nextWeek: "[Next] LLLL",
      lastDay: "[Yesterday] LL [at] LT z",
      lastWeek: "[Last] LLLL z",
      sameElse: "L LT z",
    });
  }

  return getReadableDate;
};

export default useReadableDate;
