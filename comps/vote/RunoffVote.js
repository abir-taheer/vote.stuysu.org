import { gql, useMutation } from "@apollo/client";
import Add from "@mui/icons-material/Add";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import arrayMove from "array-move";
import Script from "next/script";
import { useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import alertDialog from "../dialog/alertDialog";
import confirmDialog from "../dialog/confirmDialog";
import styles from "./RunoffVote.module.css";
import VotingCountDown from "./VotingCountDown";

const MUTATION = gql`
  mutation ($choices: [ObjectId!]!, $electionId: ObjectId!) {
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

const SortableItem = SortableElement(
  ({
    value: {
      id,
      name,
      handleMoveUp,
      choices,
      handleMoveDown,
      handleRemove,
      index,
      isDesktop,
    },
  }) => (
    <ListItem key={id} button className={"runoff-choice"}>
      <ListItemText primary={name} className={styles.name} />
      <ListItemSecondaryAction>
        {isDesktop && (
          <>
            <IconButton
              aria-label={"Move candidate up"}
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
            >
              <ArrowUpward />
            </IconButton>
            <IconButton
              aria-label={"Move Candidate Down"}
              onClick={() => handleMoveDown(index)}
              disabled={index + 1 === choices.length}
            >
              <ArrowDownward />
            </IconButton>
          </>
        )}
        <IconButton
          aria-label={"Remove Candidate"}
          onClick={() => handleRemove(index)}
          disabled={choices.length <= 1}
        >
          <Close />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
);

const SortableList = SortableContainer(
  ({ items: { choices, handleMoveUp, handleMoveDown, handleRemove } }) => {
    const isDesktop = useMediaQuery("(min-width: 800px)");

    return (
      <List className={styles.list}>
        {choices.map(({ id, name }, index) => (
          <SortableItem
            key={id}
            index={index}
            value={{
              index,
              id,
              choices,
              isDesktop,
              name,
              handleMoveUp,
              handleMoveDown,
              handleRemove,
            }}
          />
        ))}
      </List>
    );
  }
);

const RunoffVote = ({ election, candidates, refetch }) => {
  const [choices, setChoices] = useState(candidates);
  const [removed, setRemoved] = useState([]);

  const [vote, { loading }] = useMutation(MUTATION, {
    variables: {
      electionId: election.id,
      choices: choices.map((c) => c.id),
    },
  });

  const handleSubmit = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Vote",
      body: (
        <>
          <Typography variant={"body1"} className={styles.confirmHeading}>
            Just to confirm, the order of your preference is:
          </Typography>
          <ol>
            {choices.map((c) => (
              <li className={styles.confirmationList}>
                <Typography component={"span"} color={"secondary"}>
                  {c.name}
                </Typography>
              </li>
            ))}
          </ol>
        </>
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

  const handleRestore = (index) => {
    const newRemoved = [...removed];
    const restored = newRemoved.splice(index, 1);

    setRemoved(newRemoved);
    setChoices((existing) => existing.concat(restored));
  };

  const handleMoveUp = (index) => {
    const newChoices = [...choices];
    newChoices[index - 1] = choices[index];
    newChoices[index] = choices[index - 1];

    setChoices(newChoices);
  };

  const handleMoveDown = (index) => {
    const newChoices = [...choices];
    newChoices[index + 1] = choices[index];
    newChoices[index] = choices[index + 1];

    setChoices(newChoices);
  };

  return (
    <form>
      <Script
        src={"https://cdnjs.cloudflare.com/ajax/libs/slipjs/2.1.1/slip.min.js"}
        strategy={"beforeInteractive"}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Drag and drop the candidates based on your order of preference.
        </FormLabel>
        <SortableList
          items={{ choices, handleMoveUp, handleMoveDown, handleRemove }}
          onSortEnd={({ oldIndex, newIndex }) =>
            setChoices(arrayMove(choices, oldIndex, newIndex))
          }
          distance={5}
          lockAxis={"y"}
        />
        {!!removed.length && (
          <>
            <Typography variant={"body1"} color={"primary"}>
              Removed Candidates:
            </Typography>
            <Typography variant={"body2"}>
              Click on any of them to add them back to your ballot
            </Typography>
            <div>
              {removed.map(({ id, name }) => (
                <Chip
                  key={id}
                  label={name}
                  onClick={handleRestore}
                  icon={<Add />}
                  className={styles.removedChip}
                />
              ))}
            </div>
          </>
        )}
        <VotingCountDown end={election.end} />
      </FormControl>
      <Button
        variant="outlined"
        color="primary"
        className={styles.submit}
        disabled={!choices.length || loading}
        onClick={handleSubmit}
        fullWidth
      >
        Submit Vote
      </Button>
    </form>
  );
};

export default RunoffVote;
