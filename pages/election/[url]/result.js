import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import withApollo from "../../../comps/apollo/withApollo";
import UserContext from "../../../comps/auth/UserContext";
import ElectionNotFound from "../../../comps/election/ElectionNotFound";
import ElectionTabBar from "../../../comps/election/ElectionTabBar";
import PluralityResult from "../../../comps/election/PluralityResult";
import RunoffResult from "../../../comps/election/RunoffResult";
import BackButton from "../../../comps/shared/BackButton";
import LoadingScreen from "../../../comps/shared/LoadingScreen";
import layout from "../../../styles/layout.module.css";
import cat from "./../../../img/ginger-cat-access-blocked.png";

const QUERY = gql`
  query ($url: NonEmptyString!) {
    electionByUrl(url: $url) {
      id
      type
      name
      start
      end
      completed
      allowedGradYears
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
    }
  }
`;

function Result() {
  const router = useRouter();
  const { url } = router.query;
  const { data, refetch, loading } = useQuery(QUERY, {
    variables: { url },
    skip: !url,
  });
  const user = useContext(UserContext);

  // Update the election open form every 5 seconds

  if (!url || loading) {
    return <LoadingScreen />;
  }
  const election = data?.electionByUrl;

  if (!election) {
    return <ElectionNotFound href={"/election"} />;
  }

  const canShowResults = user.adminPrivileges || election.completed;

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>Results - {election.name} | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={`Results - ${election.name} | StuyBOE Voting Site`}
        />
        <meta
          property="og:description"
          content={`Results for ${election.name}`}
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

      <Typography variant={"h1"} className={layout.title} align={"center"}>
        {election.name}
      </Typography>

      <ElectionTabBar completed={election.completed} />

      {canShowResults ? (
        <>
          {election.type === "runoff" && (
            <RunoffResult id={election.id} election={election} />
          )}
          {election.type === "plurality" && (
            <PluralityResult election={election} />
          )}
        </>
      ) : (
        <>
          <div className={layout.center}>
            <Image
              src={cat}
              alt={"A cat in front of a computer"}
              className={layout.largeVector}
              height={200}
              width={200}
              objectFit={"contain"}
            />
          </div>
          <Typography align={"center"} variant={"body1"}>
            Results aren&apos;t available for this election yet
          </Typography>
        </>
      )}
    </Container>
  );
}

export default withApollo(Result, { getDataFromTree });
