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
import LoadingScreen from "../../../comps/shared/LoadingScreen";
import RunoffResult from "../../../comps/election/RunoffResult";
import cat from "./../../../img/ginger-cat-access-blocked.png";

const QUERY = gql`
  query($url: NonEmptyString!, $isReady: Boolean!) {
    electionByUrl(url: $url) @include(if: $isReady) {
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

export default function Vote() {
  const router = useRouter();
  const { url } = router.query;
  const isReady = !!url;
  const { data, refetch, loading } = useQuery(QUERY, {
    variables: { url, isReady },
  });
  const user = useContext(UserContext);

  // Update the election open form every 5 seconds

  if (!isReady || loading) {
    return <LoadingScreen />;
  }
  const election = data?.electionByUrl;

  if (!election) {
    return <ElectionNotFound href={"/election"} />;
  }

  const canShowResults = user.adminPrivileges || election.completed;

  return (
    <div className={layout.container}>
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

        {canShowResults ? (
          <>
            {election.type === "runoff" && (
              <RunoffResult id={election.id} election={election} />
            )}
          </>
        ) : (
          <>
            <img
              src={cat}
              alt={"A cat in front of a computer"}
              className={layout.largeVector}
            />
            <Typography>
              Results aren't available for this election yet
            </Typography>
          </>
        )}
      </main>
    </div>
  );
}
