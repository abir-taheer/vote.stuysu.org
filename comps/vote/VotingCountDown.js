import React, { useContext } from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import useFormatDate from "../../utils/date/useFormatDate";
import DateContext from "../shared/DateContext";
import moment from "moment-timezone";

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
