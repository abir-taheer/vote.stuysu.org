import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import withApollo from "../../../../comps/apollo/withApollo";
import CandidateCard from "../../../../comps/candidate/CandidateCard";
import ElectionNotFound from "../../../../comps/election/ElectionNotFound";
import ElectionTabBar from "../../../../comps/election/ElectionTabBar";
import BackButton from "../../../../comps/shared/BackButton";
import LoadingScreen from "../../../../comps/shared/LoadingScreen";
import layout from "../../../../styles/layout.module.css";

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
        totalStrikes
        picture {
          id
          alt
          resource {
            url
            height
            width
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

  if (typeof window !== "undefined") {
    const existing = window.sessionStorage.getItem("viewed-candidate-pages");
    let viewed = [];
    if (existing) {
      try {
        viewed = JSON.parse(existing);
      } catch (e) {
        viewed = [];
      }
    }

    const viewedSet = new Set(viewed);

    candidates.sort((a, b) => {
      const aUrl = `/election/${election.url}/candidate/${a.url}`;
      const bUrl = `/election/${election.url}/candidate/${b.url}`;

      const aViewed = viewedSet.has(aUrl);
      const bViewed = viewedSet.has(bUrl);

      if (aViewed && !bViewed) {
        return 1;
      }

      if (!aViewed && bViewed) {
        return -1;
      }

      return 0;
    });
  }

  return (
    <Container maxWidth={"md"} className={layout.page}>
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

      <BackButton
        href={"/election"}
        variant={"outlined"}
        text={"Back To Elections"}
      />

      <Typography variant={"h1"} className={layout.title} align={"center"}>
        {election.name}
      </Typography>

      <ElectionTabBar completed={election.completed} />

      <div className={layout.center}>
        <TextField
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          variant={"outlined"}
          color={"primary"}
          label={"Search"}
        />
      </div>

      <Typography
        variant={"body2"}
        align={"center"}
        gutterBottom
        sx={{ marginBottom: 3 }}
      >
        Click on any of the candidates for more info
      </Typography>

      <Grid container justifyContent={"center"} spacing={3}>
        {candidates.map(({ picture, blurb, name, url, id, totalStrikes }) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
            <CandidateCard
              picture={picture}
              blurb={blurb}
              name={name}
              strikes={totalStrikes}
              href={"/election/" + election.url + "/candidate/" + url}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default withApollo(ElectionCandidates, { getDataFromTree });
