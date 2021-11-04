import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import withApollo from "../../../../../comps/apollo/withApollo";
import CandidateNotFound from "../../../../../comps/candidate/CandidateNotFound";
import CandidateTabBar from "../../../../../comps/candidate/CandidateTabBar";
import ElectionNotFound from "../../../../../comps/election/ElectionNotFound";
import BackButton from "../../../../../comps/shared/BackButton";
import LoadingScreen from "../../../../../comps/shared/LoadingScreen";
import layout from "../../../../../styles/layout.module.css";

const QUERY = gql`
  query ($electionUrl: NonEmptyString!, $candidateUrl: NonEmptyString!) {
    candidateByUrl(url: $candidateUrl, election: { url: $electionUrl }) {
      id
      name
      blurb
      platform
      totalStrikes
      picture {
        id
        alt
        resource {
          width
          height
          resourceType
          format
          url
        }
      }
      active
      isManager
    }
    electionByUrl(url: $electionUrl) {
      id
      name
      url
      completed
    }
  }
`;

function CandidatePage() {
  const router = useRouter();
  const { url, candidateUrl } = router.query;

  const { data, loading } = useQuery(QUERY, {
    variables: { electionUrl: url, candidateUrl },
  });

  if (loading) {
    return <LoadingScreen />;
  }

  const election = data?.electionByUrl;
  const candidate = data?.candidateByUrl;
  if (!election) {
    return <ElectionNotFound href={"/election"} />;
  }

  if (!candidate) {
    return (
      <CandidateNotFound
        href={"/election/" + election.url}
        buttonLabel={"Back To " + election.name}
      />
    );
  }

  const title = `${candidate.name} for ${election.name} | StuyBOE Voting Site`;
  // Now that both election and candidate are defined we can do whatever
  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>{title}</title>
        <meta property={"og:title"} content={title} />
        <meta
          property={"description"}
          content={candidate.blurb || "Candidate for " + election.name}
        />
        <meta
          property="og:description"
          content={candidate.blurb || "Candidate for " + election.name}
        />
        <meta property="og:image" content={candidate.picture.resource?.url} />
        <meta property="og:image:alt" content={candidate.picture.alt} />
        <meta
          property="og:image:height"
          content={candidate.picture.resource.height}
        />
        <meta
          property="og:image:width"
          content={candidate.picture.resource.width}
        />
        <meta
          property="og:image:type"
          content={
            candidate.picture.resource.resourceType +
            "/" +
            candidate.picture.resource.format
          }
        />
      </Head>

      <BackButton
        href={"/election/" + election.url + "/candidate"}
        variant={"outlined"}
        text={election.name}
      />

      <div className={layout.center}>
        <Image
          src={candidate.picture.resource.url}
          alt={candidate.picture.alt}
          height={200}
          width={200}
          className={layout.candidatePicture}
        />
      </div>

      <Typography variant={"h1"} className={layout.title} color={"primary"}>
        {candidate.name}
      </Typography>

      <CandidateTabBar
        isManager={candidate.isManager}
        electionCompleted={election.completed}
        active={candidate.active}
        strikes={candidate.totalStrikes}
      />

      <div className={layout.largePageBodyContainer}>
        <Typography
          variant={"h2"}
          align={"left"}
          className={layout.spaced}
          color={"secondary"}
        >
          Blurb:
        </Typography>
        {!candidate.blurb && (
          <Typography
            variant={"body1"}
            color={"textSecondary"}
            className={layout.spaced}
          >
            This candidate has not {!election.completed && "yet"} provided a
            blurb
          </Typography>
        )}
        <Tooltip title={"Click here to change the blurb"}>
          <Typography
            variant={"body1"}
            align={"left"}
            className={layout.spaced}
          >
            {candidate.blurb}
          </Typography>
        </Tooltip>

        <Typography
          variant={"h2"}
          align={"left"}
          className={layout.spaced}
          color={"secondary"}
        >
          Platform:
        </Typography>
        {!candidate.platform && (
          <Typography
            variant={"body1"}
            color={"textSecondary"}
            className={layout.spaced}
          >
            This candidate has not {!election.completed && "yet"} provided a
            platform
          </Typography>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: candidate.platform }}
          className={layout.spaced}
        />
      </div>
    </Container>
  );
}

export default withApollo(CandidatePage, { getDataFromTree });
