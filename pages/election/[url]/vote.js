import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import withApollo from "../../../comps/apollo/withApollo";
import useLogin from "../../../comps/auth/useLogin";
import UserContext from "../../../comps/auth/UserContext";
import ElectionNotFound from "../../../comps/election/ElectionNotFound";
import ElectionTabBar from "../../../comps/election/ElectionTabBar";
import BackButton from "../../../comps/shared/BackButton";
import LoadingScreen from "../../../comps/shared/LoadingScreen";
import PluralityVote from "../../../comps/vote/PluralityVote";
import RunoffVote from "../../../comps/vote/RunoffVote";
import voteSticker from "../../../img/sticker-vota.gif";
import layout from "../../../styles/layout.module.css";
import useFormatDate from "../../../utils/date/useFormatDate";
import cherryNoMessages from "./../../../img/cherry-no-messages.png";
import gingerCatAccessBlocked from "./../../../img/ginger-cat-access-blocked.png";
import rush from "./../../../img/rush-20.png";

const QUERY = gql`
  query ($url: NonEmptyString!) {
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
        active
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

function Vote() {
  const router = useRouter();
  const { url } = router.query;
  const { data, refetch, loading } = useQuery(QUERY, { variables: { url } });
  const { now, getReadableDate } = useFormatDate(true, 1000);
  const user = useContext(UserContext);
  const { signIn } = useLogin();

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

  const candidates = election.candidates.filter((c) => c.active);

  return (
    <Container maxWidth={"md"} className={layout.page}>
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

      <BackButton
        href={"/election"}
        variant={"outlined"}
        text={"Back To Elections"}
      />

      <Typography variant={"h1"} className={layout.title} align={"center"}>
        {election.name}
      </Typography>

      <ElectionTabBar completed={election.completed} />

      {election.userIsEligible && isOpen && !data?.userHasVoted && (
        <Container maxWidth={"sm"}>
          {election.type === "plurality" && (
            <PluralityVote
              candidates={candidates}
              election={election}
              refetch={refetch}
            />
          )}

          {election.type === "runoff" && (
            <RunoffVote
              candidates={candidates}
              election={election}
              refetch={refetch}
            />
          )}
        </Container>
      )}

      {election.userIsEligible && !isOpen && (
        <>
          <Typography variant={"h2"} color={"secondary"} align={"center"}>
            This is election isn&apos;t open right now
          </Typography>

          <Image
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
              <Link href={"/election/" + url + "/result"} passHref>
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
              <Typography variant={"h2"} color={"secondary"} align={"center"}>
                Thanks for voting!
              </Typography>
              <div className={layout.center}>
                <Image
                  src={voteSticker}
                  alt={
                    "A sticker that says vota (meant to be pronounced as voter)"
                  }
                  height={200}
                  width={200}
                  objectFit={"contain"}
                  className={layout.smallVector}
                />
              </div>
            </>
          )}

          {voteId ? (
            <Container maxWidth={"sm"}>
              <Typography variant={"h3"} align={"center"}>
                Your Vote ID is: <code className={layout.voteId}>{voteId}</code>
              </Typography>
              <Typography variant={"body1"} gutterBottom>
                You can use this code after the election is over to look up your
                vote and ensure that it was recorded accurately.
              </Typography>
              <Typography variant={"body1"}>
                We&apos;ll store this code in your browser for the time being
                but, because personally identifiable information is not stored
                with your vote,{" "}
                <b>we may be unable to show this code to you again</b>. It might
                be a good idea to write it down or take a screenshot of it.
              </Typography>
            </Container>
          ) : (
            <Typography variant={"body1"} align={"center"}>
              Your vote id is not stored on this browser and cannot be
              displayed.
            </Typography>
          )}
        </>
      )}

      {user.signedIn && !election.userIsEligible && (
        <>
          <div className={layout.center}>
            <Image
              src={cherryNoMessages}
              alt={"A disappointed woman pointing at her phone"}
              className={layout.smallVector}
              height={200}
              width={200}
              objectFit={"contain"}
            />
          </div>
          <Typography
            paragraph
            variant={"body1"}
            className={layout.spaced}
            align={"center"}
          >
            You&apos;re not eligible to vote in this election
          </Typography>
        </>
      )}

      {!user.signedIn && (
        <>
          <div className={layout.center}>
            <Image
              src={gingerCatAccessBlocked}
              alt={"A sad cat in front of a lock"}
              height={200}
              width={200}
              objectFit={"contain"}
              className={layout.smallVector}
            />
          </div>

          <Typography gutterBottom paragraph variant={"body1"} align={"center"}>
            You need to be signed in to vote for this election
          </Typography>
          <div className={layout.center}>
            <Button
              variant={"contained"}
              onClick={signIn}
              color={"primary"}
              startIcon={<LockOpenIcon />}
            >
              Sign In
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default withApollo(Vote, { getDataFromTree });
