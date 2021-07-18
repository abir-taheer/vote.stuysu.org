import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import ElectionNotFound from "../../../../comps/election/ElectionNotFound";
import { gql } from "@apollo/client";
import layout from "../../../../styles/layout.module.css";
import Head from "next/head";
import BackButton from "../../../../comps/shared/BackButton";
import Typography from "@material-ui/core/Typography";
import ElectionTabBar from "../../../../comps/election/ElectionTabBar";
import { useState } from "react";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CandidateCard from "../../../../comps/candidate/CandidateCard";
import withApollo from "../../../../comps/apollo/withApollo";
import LoadingScreen from "../../../../comps/shared/LoadingScreen";

const QUERY = gql`
  query ($url: NonEmptyString!) {
    electionByUrl(url: $url) {
      id
      name
      url
      completed
      picture {
        id
        alt
        resource {
          format
          height
          width
          resourceType
          url
        }
      }
      candidates {
        id
        url
        name
        blurb
        picture {
          id
          alt
          resource {
            url
          }
        }
      }
    }
  }
`;

function ElectionCandidates() {
  const router = useRouter();
  const { url } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { url } });
  const [query, setQuery] = useState("");

  if (loading) {
    return <LoadingScreen />;
  }

  const election = data?.electionByUrl;

  if (!election) {
    return <ElectionNotFound href={"/election"} />;
  }

  const title = `Candidates - ${election.name} | StuyBOE Voting Site`;

  const keywords = query.toLowerCase().split(/\s+/);

  const candidates = election.candidates.filter((candidate) =>
    keywords.every(
      (word) =>
        candidate.name.toLowerCase().includes(word) ||
        candidate.blurb.toLowerCase().includes(word)
    )
  );

  return (
    <div className={layout.container}>
      <Head>
        <title>{title}</title>
        <meta property={"og:title"} content={title} />
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
        <Typography variant={"h1"} className={layout.title}>
          {election.name}
        </Typography>

        <ElectionTabBar completed={election.completed} />

        <TextField
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          variant={"outlined"}
          color={"primary"}
          label={"Search"}
        />
        <Typography variant={"body2"} gutterBottom className={layout.spaced}>
          Click on any of the candidates for more info
        </Typography>

        <Grid container justify={"center"} className={layout.grid} spacing={3}>
          {candidates.map(({ picture, blurb, name, url, id }) => (
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
              <CandidateCard
                picture={picture}
                blurb={blurb}
                name={name}
                href={"/election/" + election.url + "/candidate/" + url}
              />
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
}

export default withApollo({ ssr: true })(ElectionCandidates);
