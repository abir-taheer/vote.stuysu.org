import UserContext from "../auth/UserContext";
import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import BarChart from "@material-ui/icons/BarChart";
import PeopleOutlined from "@material-ui/icons/PeopleOutlined";
import useLogin from "../auth/useLogin";
import HowToVoteOutlined from "@material-ui/icons/HowToVoteOutlined";
import layout from "../../styles/layout.module.css";
import waitingPale from "./../../img/pale-waiting.png";
import dalia from "./../../img/dalia-by-cindy-zheng.gif";
import ImageWithPopover from "../shared/ImageWithPopover";
import StyledLink from "@material-ui/core/Link";

const ElectionOverviewText = ({
  isOpen,
  userIsEligible,
  completed,
  userHasVoted,
  start,
  end,
  url,
  now,
  refetch,
}) => {
  const { signedIn } = useContext(UserContext);
  const { signIn, loading } = useLogin({ onLogin: refetch });

  if (completed) {
    return (
      <>
        <div className={layout.centerContainer}>
          <img
            src={dalia}
            alt={"A small blob blowing confetti. Art by Cindy Zheng"}
            className={layout.smallVector}
          />
        </div>

        <Typography variant={"h3"}>
          The election's over and results are available 🎉
        </Typography>

        {userHasVoted && (
          <Typography variant={"body1"} color={"primary"} paragraph>
            Someone awesome voted in this election (hint: it's you! 😎)
          </Typography>
        )}

        <Link href={"/election/" + url + "/candidate"}>
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<BarChart />}
          >
            View Results
          </Button>
        </Link>
      </>
    );
  }

  // We can assume the election isn't complete for any of the statements below
  // The election is over but not complete, give a little reassurance message here
  if (now > end) {
    return (
      <>
        <div className={layout.centerContainer}>
          <img
            src={waitingPale}
            alt={"Someone leaning against a clock"}
            className={layout.smallVector}
          />
        </div>

        <br />
        <Typography variant={"h3"}>
          The election's over but results aren't out yet
        </Typography>

        <Typography variant={"body1"} paragraph gutterBottom>
          Don't worry, this page will automatically update once they're out 😌
        </Typography>
      </>
    );
  }

  // We can presume it's now before the end time
  if (userHasVoted) {
    return (
      <>
        <Typography variant={"h3"}>Thanks for voting! 🥰 </Typography>

        <Typography variant={"body1"} paragraph>
          The election isn't over yet, but this page will automatically update
          once results are available
        </Typography>
      </>
    );
  }

  // At this point it's before the end date and the user hasn't voted
  if (userIsEligible && isOpen) {
    return (
      <>
        <Typography variant={"h3"}>
          You're eligible. It's time to vote! 🤩
        </Typography>
        <Link href={"/election/" + url + "/vote"}>
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<HowToVoteOutlined />}
          >
            Vote For This Election
          </Button>
        </Link>
      </>
    );
  }

  if (userIsEligible && !isOpen) {
    return (
      <>
        <Typography variant={"h3"}>
          ⌛ You're eligible, but it's not time to vote yet ⌛
        </Typography>
        <Typography variant={"body1"}>
          In the meantime, &nbsp;&nbsp;
          <Link href={"/election/" + url + "/candidate"}>
            <Button
              variant={"outlined"}
              color={"primary"}
              startIcon={<PeopleOutlined />}
            >
              Check out the candidates
            </Button>
          </Link>
        </Typography>
      </>
    );
  }

  // At this point the user is not eligible or not signed in
  if (isOpen && !signedIn) {
    return (
      <>
        <Typography variant={"h3"}>There's still time to vote ⌛</Typography>
        <Typography variant={"body1"} paragraph>
          <Button
            variant={"contained"}
            color={"primary"}
            onClick={signIn}
            disabled={loading}
          >
            Sign In
          </Button>
          &nbsp;, and we'll check if you're eligible for this election
        </Typography>
      </>
    );
  }

  if (signedIn) {
    return (
      <>
        <Typography variant={"h3"}>
          It looks like you're not eligible for this election
        </Typography>
        <Typography variant={"body1"}>
          Still, that doesn't mean you can't have a look around &nbsp;
          ¯\_(ツ)_/¯
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant={"h3"}>The election hasn't started yet</Typography>
      <Typography variant={"body1"}>
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={signIn}
          disabled={loading}
        >
          Sign In
        </Button>
        &nbsp;, and we'll check if you're eligible for this election
      </Typography>
    </>
  );
};

export default ElectionOverviewText;
