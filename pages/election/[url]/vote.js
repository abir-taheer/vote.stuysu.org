import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserContext from "../../../comps/auth/UserContext";
import layout from "../../../styles/layout.module.css";
import Head from "next/head";
import BackButton from "../../../comps/shared/BackButton";
import Typography from "@material-ui/core/Typography";
import ElectionTabBar from "../../../comps/election/ElectionTabBar";
import ElectionNotFound from "../../../comps/election/ElectionNotFound";
import PluralityVote from "../../../comps/vote/PluralityVote";
import useFormatDate from "../../../utils/date/useFormatDate";
import Button from "@material-ui/core/Button";
import useLogin from "../../../comps/auth/useLogin";
import gingerCatAccessBlocked from "./../../../img/ginger-cat-access-blocked.png";
import cherryNoMessages from "./../../../img/cherry-no-messages.png";
import rush from "./../../../img/rush-20.png";
import Link from "next/link";
import voteSticker from "../../../img/sticker-vota.gif";
import LoadingScreen from "../../../comps/shared/LoadingScreen";

const QUERY = gql`
  query($url: NonEmptyString!) {
    electionByUrl(url: $url) {
      id
      type
      name
      start
      end
      completed
      candidates(sort: random) {
        id
        name
      }
      picture {
        id
        alt
        resource {
          url
          height
          width
          resourceType
          format
        }
      }
      userIsEligible
      isOpen
    }
    userHasVoted(election: { url: $url })
  }
`;

export default function Vote() {
  const router = useRouter();
  const { url } = router.query;
  const { data, refetch, loading } = useQuery(QUERY, { variables: { url } });
  const { now, getReadableDate } = useFormatDate(true, 1000);
  const user = useContext(UserContext);
  const { signIn } = useLogin({ onLogin: refetch });

  // Update the election open form every 5 seconds
  const election = data?.electionByUrl;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!election) {
    return <ElectionNotFound href={"/election"} />;
  }

  const voteId = globalThis?.localStorage?.getItem("vote-id-" + election.id);

  const start = new Date(election.start);
  const end = new Date(election.end);

  // Determine this locally to avoid refreshing
  const isOpen = now > start && now < end && !election.completed;

  return (
    <div className={layout.container}>
      <Head>
        <title>Vote - {election.name} | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={`Vote - ${election.name} | StuyBOE Voting Site`}
        />
        <meta property="og:description" content={`Vote for ${election.name}`} />
        <meta property="og:image" content={election.picture.resource?.url} />
        <meta property="og:image:alt" content={election.picture.alt} />
        <meta
          property="og:image:height"
          content={election.picture.resource.height}
        />
        <meta
          property="og:image:width"
          content={election.picture.resource.width}
        />
        <meta
          property="og:image:type"
          content={
            election.picture.resource.resourceType +
            "/" +
            election.picture.resource.format
          }
        />
      </Head>

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

        {election.userIsEligible && isOpen && !data?.userHasVoted && (
          <>
            {election.type === "plurality" && (
              <PluralityVote
                candidates={election.candidates}
                election={election}
                refetch={refetch}
              />
            )}
          </>
        )}

        {election.userIsEligible && !isOpen && (
          <>
            <Typography variant={"h2"} color={"secondary"}>
              This is election isn't open right now
            </Typography>

            <img
              src={rush}
              alt={"A yoyo with a clock on it"}
              className={layout.smallVector}
            />

            {now < start && (
              <Typography variant={"body1"}>
                Starts {getReadableDate(start)}
              </Typography>
            )}

            {now > end && (
              <Typography variant={"body1"}>
                Ended {getReadableDate(end)}
              </Typography>
            )}

            {election.completed && (
              <Typography>
                <Link href={"/election/" + url + "/result"}>
                  <Button variant={"outlined"} color={"primary"}>
                    Results
                  </Button>
                </Link>{" "}
                &nbsp;for this election are available
              </Typography>
            )}
            <br />
          </>
        )}

        {data?.userHasVoted && (
          <>
            {isOpen && (
              <>
                <Typography variant={"h2"} color={"secondary"}>
                  Thanks for voting!
                </Typography>
                <img
                  src={voteSticker}
                  alt={
                    "A sticker that says vota (meant to be pronounced as voter)"
                  }
                  className={layout.smallVector}
                />
              </>
            )}

            {voteId ? (
              <>
                <Typography variant={"h3"} align={"center"}>
                  Your Vote ID is:{" "}
                  <code className={layout.voteId}>{voteId}</code>
                </Typography>
                <Typography
                  variant={"body1"}
                  className={layout.fixedWidthDescription}
                  gutterBottom
                >
                  You can use this code after the election is over to look up
                  your vote and ensure that it was recorded accurately.
                </Typography>
                <Typography
                  variant={"body1"}
                  className={layout.fixedWidthDescription}
                >
                  We'll store this code in your browser for the time being but,
                  because personally identifiable information is not stored with
                  your vote,{" "}
                  <b>we may be unable to show this code to you again</b>. It
                  might be a good idea to write it down or take a screenshot of
                  it.
                </Typography>
              </>
            ) : (
              <Typography variant={"body1"}>
                Your vote id is not stored on this browser and cannot be
                displayed.
              </Typography>
            )}
          </>
        )}

        {user.signedIn && !election.userIsEligible && (
          <>
            <img
              src={cherryNoMessages}
              alt={"A disappointed woman pointing at her phone"}
              className={layout.smallVector}
            />
            <Typography paragraph variant={"body1"} className={layout.spaced}>
              You're not eligible to vote in this election
            </Typography>
          </>
        )}

        {!user.signedIn && (
          <>
            <img
              src={gingerCatAccessBlocked}
              alt={"A sad cat in front of a lock"}
              className={layout.smallVector}
            />
            <Typography gutterBottom paragraph variant={"body1"}>
              You need to be signed in to vote for this election
            </Typography>
            <Button variant={"contained"} onClick={signIn} color={"primary"}>
              Sign In
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
