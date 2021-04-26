import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import withApollo from "../../comps/apollo/withApollo";
import layout from "./../../styles/layout.module.css";
import Error404 from "../404";
import Typography from "@material-ui/core/Typography";
import ElectionTabBar from "../../comps/election/ElectionTabBar";
import BackButton from "../../comps/shared/BackButton";
import useFormatDate from "../../utils/date/useFormatDate";
import capitalize from "@material-ui/core/utils/capitalize";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import PeopleOutlined from "@material-ui/icons/PeopleOutlined";
import HowToVote from "@material-ui/icons/HowToVote";
import UserContext from "../../comps/auth/UserContext";
import useLogin from "../../comps/auth/useLogin";
import ElectionOverviewText from "../../comps/election/ElectionOverviewText";

const ELECTION_QUERY = gql`
  query($url: String!) {
    electionByUrl(url: $url) {
      id
      type
      name
      start
      end
      completed
      picture {
        id
        resource {
          url
        }
      }
      userIsEligible
      isOpen
    }

    userHasVoted(election: { url: $url })
  }
`;

const Election = () => {
  const user = useContext(UserContext);
  const { signIn, loading: signInLoading } = useLogin();
  const router = useRouter();
  const { url } = router.query;
  const { data, refetch } = useQuery(ELECTION_QUERY, { variables: { url } });
  const { getReadableDate, now } = useFormatDate(true, 10000);

  // Refetch every 10 seconds so the user knows exactly when the election ends
  useEffect(async () => {
    await refetch();
  }, [now]);

  const election = data?.electionByUrl;
  if (!election) {
    return <Error404 />;
  }

  const start = new Date(election.start);
  const end = new Date(election.end);

  return (
    <div className={layout.container}>
      <main className={layout.main}>
        <BackButton
          href={"/election"}
          variant={"outlined"}
          text={"Back To Elections"}
        />
        <Typography variant={"h1"} className={layout.title} color={"primary"}>
          {election.name}
        </Typography>

        <ElectionTabBar completed={election.completed} />
        <div>
          <Typography variant={"body1"}>
            Start{now < start ? "s" : "ed"}:{" "}
            <Typography color={"secondary"} component={"span"}>
              {capitalize(getReadableDate(start))}
            </Typography>
          </Typography>
          <Typography variant={"body1"}>
            End{now < end ? "s" : "ed"}:{" "}
            <Typography color={"secondary"} component={"span"}>
              {capitalize(getReadableDate(end))}
            </Typography>
          </Typography>

          <br />

          <ElectionOverviewText
            completed={election.completed}
            url={url}
            end={end}
            start={start}
            isOpen={election.isOpen}
            userHasVoted={data.userHasVoted}
            userIsEligible={election.userIsEligible}
            now={now}
            refetch={refetch}
          />
        </div>
      </main>
    </div>
  );
};

export default withApollo({ ssr: true })(Election);
