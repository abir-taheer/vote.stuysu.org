import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { TextField } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import withApollo from "../../../../../comps/apollo/withApollo";
import CandidateTabBar from "../../../../../comps/candidate/CandidateTabBar";
import BackButton from "../../../../../comps/shared/BackButton";
import LoadingScreen from "../../../../../comps/shared/LoadingScreen";
import Error404 from "../../../../404";
import layout from "./../../../../../styles/layout.module.css";
const QUERY = gql`
  query ($candidateUrl: NonEmptyString!, $electionUrl: NonEmptyString!) {
    candidateByUrl(url: $candidateUrl, election: { url: $electionUrl }) {
      id
      name
      picture {
        id
        alt
        resource {
          height
          width
          url
        }
      }
      isManager
      totalStrikes
      active
    }
    electionByUrl(url: $electionUrl) {
      id
      name
      completed
    }
  }
`;

function CandidateManagePage() {
  const router = useRouter();
  const { url, candidateUrl } = router.query;
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      electionUrl: url,
      candidateUrl,
    },
    skip: !candidateUrl || !url,
  });

  if (error) {
    return (
      <Typography variant={"body1"} color={"error"} align={"center"}>
        {error.message}
      </Typography>
    );
  }

  if (loading || !candidateUrl || !url) {
    return <LoadingScreen />;
  }

  const election = data?.electionByUrl;
  const candidate = data?.candidateByUrl;

  if (!data || !candidate || !election) {
    return <Error404 />;
  }

  const title = `Manage ${candidate.name} | StuyBOE Voting Site`;

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>{title}</title>
        <meta property={"og:title"} content={title} />
        <meta
          property={"description"}
          content={"Manage the candidate page for " + candidate.name}
        />
        <meta
          property="og:description"
          content={"Manage the candidate page for " + candidate.name}
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

      <form>
        <TextField />
      </form>
    </Container>
  );
}

export default withApollo(CandidateManagePage, { getDataFromTree });
