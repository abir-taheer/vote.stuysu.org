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
import Image from "next/image";

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
        <div className={layout.center}>
          <Image
            src={dalia}
            objectFit={"contain"}
            height={150}
            width={200}
            alt={"A small blob blowing confetti. Art by Cindy Zheng"}
            className={layout.smallVector}
          />
        </div>
        <Typography variant={"h3"} align={"center"}>
          The election's over and results are available 🎉
        </Typography>

        {userHasVoted && (
          <Typography
            variant={"body1"}
            color={"primary"}
            paragraph
            align={"center"}
          >
            Someone awesome voted in this election (hint: it's you! 😎)
          </Typography>
        )}

        <div className={layout.center}>
          <Link href={"/election/" + url + "/result"} passHref>
            <Button
              variant={"contained"}
              color={"secondary"}
              startIcon={<BarChart />}
            >
              View Results
            </Button>
          </Link>
        </div>
      </>
    );
  }

  // We can assume the election isn't complete for any of the statements below
  // The election is over but not complete, give a little reassurance message here
  if (now > end) {
    return (
      <>
        <Image
          src={waitingPale}
          alt={"Someone leaning against a clock"}
          objectFit={"contain"}
          height={200}
          width={200}
          className={layout.smallVector}
        />

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
        <Typography variant={"h3"} align={"center"}>
          Thanks for voting! 🥰
        </Typography>

        <Typography variant={"body1"} paragraph align={"center"}>
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
        <Typography variant={"h3"} align={"center"}>
          You're eligible. It's time to vote! 🤩
        </Typography>

        <div className={layout.center}>
          <Link href={"/election/" + url + "/vote"} passHref>
            <Button
              variant={"contained"}
              color={"secondary"}
              startIcon={<HowToVoteOutlined />}
            >
              Vote For This Election
            </Button>
          </Link>
        </div>
      </>
    );
  }

  if (userIsEligible && !isOpen) {
    return (
      <>
        <Typography variant={"h3"} align={"center"}>
          ⌛ You're eligible, but it's not time to vote yet ⌛
        </Typography>
        <Typography variant={"body1"} align={"center"}>
          In the meantime, &nbsp;&nbsp;
          <Link href={"/election/" + url + "/candidate"} passHref>
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
        <Typography variant={"h3"} align={"center"}>
          There's still time to vote ⌛
        </Typography>
        <Typography variant={"body1"} paragraph align={"center"}>
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
        <Typography variant={"h3"} align={"center"}>
          It looks like you're not eligible for this election
        </Typography>
        <Typography variant={"body1"} align={"center"}>
          Still, that doesn't mean you can't have a look around &nbsp;
          ¯\_(ツ)_/¯
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant={"h3"} align={"center"}>
        The election hasn't started yet
      </Typography>
      <Typography variant={"body1"} align={"center"}>
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
