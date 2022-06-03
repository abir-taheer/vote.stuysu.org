import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { Card, Grid } from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

      candidates {
        id
        url
        name
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
      }
    }
  }
`;

function CandidatePage() {
  const router = useRouter();
  const { url, candidateUrl } = router.query;

  const { data, loading } = useQuery(QUERY, {
    variables: { electionUrl: url, candidateUrl },
  });

  useEffect(() => {
    const existing = window.sessionStorage.getItem("viewed-candidate-pages");
    let viewed = [];
    if (existing) {
      try {
        viewed = JSON.parse(existing);
      } catch (e) {
        viewed = [];
      }
    }

    if (!viewed.includes(router.asPath)) {
      viewed.push(router.asPath);
      window.sessionStorage.setItem(
        "viewed-candidate-pages",
        JSON.stringify(viewed)
      );
    }
  }, [router]);

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

  const otherCandidates = election.candidates.filter(
    (c) => c.id !== candidate.id
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

    otherCandidates.sort((a, b) => {
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
          Summary Blurb:
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
        <Typography
          variant={"body1"}
          align={"left"}
          className={layout.spaced}
          sx={{
            maxWidth: "100%",
            overflowWrap: "break-word",
          }}
        >
          {candidate.blurb}
        </Typography>

        <Typography
          variant={"h2"}
          align={"left"}
          className={layout.spaced}
          color={"secondary"}
        >
          Platform / Policies:
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
          className={layout.spaced + " sanitized-html"}
        />

        <Typography
          variant="h1"
          align="center"
          color="primary"
          sx={{ margin: 5 }}
        >
          Other Candidates
        </Typography>
        <Grid container spacing={3} columns={{ xs: 6, sm: 9, md: 12 }}>
          {otherCandidates.map((c) => (
            <Grid key={c.id} item xs={3} md={3}>
              <Card>
                <Link
                  href={`/election/${election.url}/candidate/${c.url}`}
                  passHref
                >
                  <CardActionArea sx={{ paddingTop: 2 }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Image
                        src={c.picture?.resource?.url}
                        alt={c.picture?.alt}
                        objectFit={"cover"}
                        height={80}
                        width={80}
                        className={"crop-circle"}
                      />
                    </div>
                    <CardContent>
                      <Typography gutterBottom variant="body1" align={"center"}>
                        {c.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
}

export default withApollo(CandidatePage, { getDataFromTree });
