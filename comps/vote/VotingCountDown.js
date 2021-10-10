import FormHelperText from "@mui/material/FormHelperText";
import moment from "moment-timezone";
import React, { useContext } from "react";
import useFormatDate from "../../utils/date/useFormatDate";
import DateContext from "../shared/DateContext";

const VotingCountDown = ({ end }) => {
  const { formatDuration } = useFormatDate(false);
  const { getNow } = useContext(DateContext);
  const now = moment(getNow());
  const endMoment = moment(end);
  const duration = moment.duration(endMoment.diff(now));

  return (
    <FormHelperText>
      Voting will end in {formatDuration(duration)}
    </FormHelperText>
  );
};

export default VotingCountDown;
