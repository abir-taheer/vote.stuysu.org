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
import useFormatDate from "../../../utils/date/useFormatDate";
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
  const { data, refetch, loading } = useQuery(QUERY, { variables: { url } });
  const { now, getReadableDate } = useFormatDate(true, 1000);
  const user = useContext(UserContext);

  // Update the election open form every 5 seconds
  const election = data?.electionByUrl;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!election) {
    return <ElectionNotFound href={"/election"} />;
  }

  const voteId = globalThis?.localStorage?.getItem("vote-id-" + election.id);

  return (
    <div className={layout.container}>
      <Head>
        <title>Results - {election.name} | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={`Vote - ${election.name} | StuyBOE Voting Site`}
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
      </main>
    </div>
  );
}
