import { gql, useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import moment from "moment-timezone";
import { useContext, useRef, useState } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import useFormatDate from "../../utils/date/useFormatDate";
import alertDialog from "../dialog/alertDialog";
import confirmDialog from "../dialog/confirmDialog";
import DateContext from "../shared/DateContext";

const MUTATION = gql`
  mutation ($candidateId: ObjectID!, $electionId: ObjectID!) {
    votePlurality(candidateId: $candidateId, electionId: $electionId) {
      id
      choice {
        id
        name
      }
      gradYear
    }
  }
`;

const styles = {
  option: {
    marginBottom: "0.5rem",
  },

  submit: {
    margin: "1rem 0",
  },

  voteId: {
    background: "rgba(0, 0, 0, 0.08)",
    borderRadius: "10px",
    padding: "0.5rem",
    color: "#6c5ce7",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },

  sticker: {
    maxWidth: "200px",
    maxHeight: "200px",
    objectFit: "contain",
  },
};

function PluralityVote({ election, candidates, refetch }) {
  const [candidateId, setCandidateId] = useState(null);
  const { formatDuration } = useFormatDate(false);
  const { getNow } = useContext(DateContext);
  const [vote, { loading }] = useMutation(MUTATION, {
    variables: {
      electionId: election.id,
      candidateId,
    },
  });
  const voteLoaded = useRef(new Date());

  const now = moment(getNow());
  const end = moment(election.end);
  const duration = moment.duration(end.diff(now));

  const handleSubmit = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Vote",
      body: (
        <Typography variant={"body1"}>
          Just to confirm, you would like to cast your vote for{" "}
          <Typography component={"span"} color={"primary"}>
            {candidates.find((a) => a.id === candidateId).name}
          </Typography>
          ?
        </Typography>
      ),
    });

    if (confirmation) {
      gaEvent({
        category: "vote",
        action: "user confirmed vote",
        label: election.name,
        nonInteraction: false,
      });

      try {
        const { data } = await vote();
        window.localStorage.setItem(
          "vote-id-" + election.id,
          data.votePlurality.id
        );

        const end = new Date();
        const time = end.getTime() - voteLoaded.current.getTime();
        const seconds = Math.round(time / 1000);

        gaEvent({
          category: "vote",
          action: "voting time - " + election.name,
          label: seconds + "s",
          nonInteraction: true,
        });

        await refetch();
      } catch (e) {
        await alertDialog({
          title: "Could not perform action",
          body: (
            <Typography variant={"body1"}>
              There was an error processing your vote:{" "}
              <Typography component={"span"} color={"primary"}>
                {e.message}
              </Typography>
            </Typography>
          ),
        });
      }
    } else {
      gaEvent({
        category: "vote",
        action: "user cancelled vote",
        label: election.name,
        nonInteraction: false,
      });
    }
  };

  return (
    <form>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Select your candidate of preference
        </FormLabel>
        <RadioGroup value={candidateId} onChange={(ev, i) => setCandidateId(i)}>
          {candidates.map(({ id, name }) => (
            <FormControlLabel
              value={id}
              key={id}
              control={<Radio />}
              label={name}
              sx={styles.option}
            />
          ))}
        </RadioGroup>

        <FormHelperText>
          Voting will end in {formatDuration(duration)}
        </FormHelperText>
      </FormControl>

      <Button
        fullWidth
        variant="outlined"
        color="primary"
        sx={styles.submit}
        disabled={!candidateId || loading}
        onClick={handleSubmit}
      >
        Submit Vote
      </Button>
    </form>
  );
}

export default PluralityVote;
