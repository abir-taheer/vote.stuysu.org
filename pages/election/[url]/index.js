import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import TouchApp from "@mui/icons-material/TouchApp";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import withApollo from "../../../comps/apollo/withApollo";
import ElectionAnnouncementCard from "../../../comps/election/ElectionAnnouncementCard";
import ElectionOverviewText from "../../../comps/election/ElectionOverviewText";
import ElectionTabBar from "../../../comps/election/ElectionTabBar";
import BackButton from "../../../comps/shared/BackButton";
import LoadingScreen from "../../../comps/shared/LoadingScreen";
import layout from "../../../styles/layout.module.css";
import gaEvent from "../../../utils/analytics/gaEvent";
import useFormatDate from "../../../utils/date/useFormatDate";
import capitalize from "../../../utils/text/capitalize";
import Error404 from "../../404";

const ELECTION_QUERY = gql`
  query ($url: NonEmptyString!) {
    electionByUrl(url: $url) {
      id
      type
      name
      start
      end
      completed
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
      activeAnnouncements {
        id
        title
        body
        updatedAt
      }
      userIsEligible
      isOpen
    }

    userHasVoted(election: { url: $url })
  }
`;

const ElectionCandidates = () => {
  const router = useRouter();
  const url = router.query.url || "";
  const { data, loading, refetch } = useQuery(ELECTION_QUERY, {
    variables: { url },
    skip: !url,
  });

  const { getReadableDate, now } = useFormatDate(true, 10000);

  // Refetch every 10 seconds so the user knows exactly when the election ends
  useEffect(() => {
    refetch();
  }, [now, refetch]);

  if (loading) {
    return <LoadingScreen />;
  }

  const election = data?.electionByUrl;
  if (!election) {
    return <Error404 />;
  }

  const start = new Date(election.start);
  const end = new Date(election.end);

  const voteId = globalThis?.localStorage?.getItem("vote-id-" + election.id);

  return (
    <Container className={layout.page} maxWidth={"md"}>
      <Head>
        <title>{election.name} | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={`${election.name} | StuyBOE Voting Site`}
        />
        <meta
          property="og:description"
          content={`Learn about the candidates, vote, and view results for ${election.name}`}
        />
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
      <Typography variant={"h1"} className={layout.title}>
        {election.name}
      </Typography>

      <ElectionTabBar completed={election.completed} />

      {!!voteId && (
        <Typography variant={"h3"} gutterBottom align={"center"}>
          Your Vote ID Is: <code className={layout.voteId}>{voteId}</code>
        </Typography>
      )}

      <div className={layout.contentContainer}>
        <Typography variant={"h2"} color={"primary"} align={"center"}>
          Status 💡
        </Typography>

        <Container maxWidth={"xs"}>
          <Typography variant={"body1"}>
            Type:{" "}
            <Typography color={"secondary"} component={"span"}>
              {election.type === "runoff" &&
                "Instant Runoff Voting (Ranked Choice)"}
              {election.type === "plurality" && "Plurality (Single Choice)"}
            </Typography>
          </Typography>
          {election.type === "runoff" && (
            <Link
              href={`/faq/what-is-instant-runoff-voting?backLabel=${encodeURIComponent(
                "Back to " + election.name
              )}&backPath=${router.asPath}`}
              passHref
            >
              <Button
                startIcon={<TouchApp />}
                variant={election.completed ? "outlined" : "contained"}
                color={"secondary"}
                fullWidth
                onClick={() => {
                  gaEvent({
                    category: "click",
                    action: "what is instant runoff voting button",
                    label: election.name,
                    nonInteraction: false,
                  });
                }}
                sx={{ marginBottom: "1rem" }}
              >
                What&apos;s Instant Runoff Voting?
              </Button>
            </Link>
          )}

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
        </Container>

        <br />

        <Container maxWidth={"sm"}>
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
        </Container>
      </div>

      {!!election.activeAnnouncements.length && (
        <div className={layout.spaced}>
          <Typography variant={"h2"} color={"primary"} align={"center"}>
            Announcements 📣
          </Typography>

          <Container maxWidth={"sm"}>
            {election.activeAnnouncements.map((announcement) => (
              <ElectionAnnouncementCard
                key={announcement.id}
                title={announcement.title}
                body={announcement.body}
                updatedAt={announcement.updatedAt}
              />
            ))}
          </Container>
        </div>
      )}
    </Container>
  );
};

export default withApollo(ElectionCandidates, { getDataFromTree });
