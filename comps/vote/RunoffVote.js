import { gql } from "@apollo/client/core";
import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import DateContext from "../shared/DateContext";
import moment from "moment-timezone";
import useFormatDate from "../../utils/date/useFormatDate";
import styles from "./RunoffVote.module.css";
import confirmDialog from "../dialog/confirmDialog";
import Typography from "@material-ui/core/Typography";
import alertDialog from "../dialog/alertDialog";
import Head from "next/head";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";

const MUTATION = gql`
  mutation($choices: [ObjectId!]!, $electionId: ObjectId!) {
    voteRunoff(choices: $choices, electionId: $electionId) {
      id
      choices {
        id
        name
      }
      gradYear
    }
  }
`;

const RunoffVote = ({ election, candidates, refetch }) => {
  const [choices, setChoices] = useState(candidates);
  const [removed, setRemoved] = useState([]);
  const { formatDuration } = useFormatDate(false);
  const { getNow } = useContext(DateContext);
  const [vote, { loading }] = useMutation(MUTATION, {
    variables: {
      electionId: election.id,
      choices: choices.map((c) => c.id),
    },
  });

  const now = moment(getNow());
  const end = moment(election.end);
  const duration = moment.duration(end.diff(now));

  const handleSubmit = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Vote",
      body: (
        <Typography variant={"body1"}>
          Just to confirm, the order of your preference is:
          <ol>
            {choices.map((c) => (
              <li>
                <Typography component={"span"} color={"secondary"}>
                  {c.name}
                </Typography>
              </li>
            ))}
          </ol>
        </Typography>
      ),
    });

    if (confirmation) {
      try {
        const { data } = await vote();
        window.localStorage.setItem(
          "vote-id-" + election.id,
          data.voteRunoff.id
        );
        await refetch();
      } catch (e) {
        await alertDialog({
          title: "Could not perform action",
          body: (
            <Typography variant={"body1"}>
              There was an error processing your vote:{" "}
              <Typography
                component={"span"}
                color={"primary"}
                children={e.message}
              />
            </Typography>
          ),
        });
      }
    }
  };

  const handleRemove = (index) => {
    const newChoices = [...choices];
    const removed = newChoices.splice(index, 1);

    setChoices(newChoices);
    setRemoved((existing) => existing.concat(removed));
  };

  const handleMoveUp = (index) => {
    const newChoices = [...choices];

    const temp = choices[index - 1];
    choices[index - 1] = choices[index];
    choices[index] = temp;

    setChoices(newChoices);
  };

  const handleMoveDown = (index) => {
    const newChoices = [...choices];

    const temp = choices[index + 1];
    choices[index + 1] = choices[index];
    choices[index] = temp;

    setChoices(newChoices);
  };

  return (
    <form>
      <Head>
        <script
          src={
            "https://cdnjs.cloudflare.com/ajax/libs/slipjs/2.1.1/slip.min.js"
          }
        />
      </Head>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Order the candidates based on your preference
        </FormLabel>

        <List>
          {choices.map(({ id, name }, i) => (
            <ListItem key={id}>
              <ListItemText primary={name} />
              {choices.length > 1 && (
                <ListItemSecondaryAction>
                  {i > 0 && (
                    <IconButton
                      aria-label={"Move candidate up"}
                      onClick={() => handleMoveUp(i)}
                    >
                      <ArrowUpward />
                    </IconButton>
                  )}
                  {i + 1 < choices.length && (
                    <IconButton
                      aria-label={"Move Candidate Down"}
                      onClick={() => handleMoveDown(i)}
                    >
                      <ArrowDownward />
                    </IconButton>
                  )}

                  <IconButton
                    aria-label={"Remove Candidate"}
                    onClick={() => handleRemove(i)}
                  >
                    <Close />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>

        <FormHelperText>
          Voting will end in {formatDuration(duration)}
        </FormHelperText>
        <Button
          variant="outlined"
          color="primary"
          className={styles.submit}
          disabled={!choices.length || loading}
          onClick={handleSubmit}
        >
          Submit Vote
        </Button>
      </FormControl>
    </form>
  );
};

export default RunoffVote;
