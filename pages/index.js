import { gql, useQuery } from "@apollo/client";
import HowToVote from "@mui/icons-material/HowToVote";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import withApollo from "../comps/apollo/withApollo";
import LoginButton from "../comps/auth/LoginButton";
import UserContext from "../comps/auth/UserContext";
import ElectionCard from "../comps/election/ElectionCard";
import CenteredCircularProgress from "../comps/shared/CenteredCircularProgress";
import styles from "../styles/Home.module.css";
import layout from "../styles/layout.module.css";
import voting from "./../img/voting.svg";

const QUERY = gql`
  query {
    currentElections {
      id
      name
      url
      start
      end
      picture {
        id
        resource {
          id
          url
          width
          height
        }
        alt
      }
    }
  }
`;

function Home() {
  const user = useContext(UserContext);

  const { data, loading } = useQuery(QUERY);

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>Home | StuyBOE Voting Site</title>
        <meta property={"og:title"} content={"Home | StuyBOE Voting Site"} />
        <meta
          property={"og:image"}
          content={"https://vote.stuysu.org/logo512.png"}
        />
        <meta property={"og:image:height"} content={512} />
        <meta property={"og:image:width"} content={512} />
        <meta property={"og:image:alt"} content={"Board of Elections Logo"} />
        <meta property="og:image:type" content="image/png" />
      </Head>

      <Typography
        variant={"h1"}
        align={"center"}
        className={styles.title}
        sx={{ margin: 0, lineHeight: 1.15, fontSize: "4rem" }}
      >
        <span className={styles.purpleTextGradient}>Make your voice heard</span>{" "}
        📢
      </Typography>

      <Typography
        variant={"subtitle1"}
        align={"center"}
        sx={{
          lineHeight: 1.5,
          fontSize: "1.3rem",
          margin: "0.8em 0",
        }}
        paragraph
      >
        &quot;There&apos;s no such thing as a vote that doesn&apos;t
        matter.&quot;
      </Typography>

      <div className={layout.center}>
        <Image
          src={voting}
          alt={"People representing voting"}
          className={layout.largeVector}
          height={270}
          width={300}
          objectFit={"contain"}
        />
      </div>

      {loading && <CenteredCircularProgress />}

      {!!data?.currentElections?.length && (
        <>
          <Typography align={"center"} variant={"h2"} gutterBottom>
            Current Elections
          </Typography>
          <Grid
            container
            alignContent={"center"}
            alignItems={"center"}
            justifyItems={"center"}
            justifyContent={"center"}
            sx={{ marginBottom: "2rem" }}
            rowGap={2}
            columnGap={2}
          >
            {data.currentElections.map((election) => (
              <ElectionCard
                key={election.id}
                picture={election.picture}
                name={election.name}
                start={election.start}
                end={election.end}
                href={"/election/" + election.url}
              />
            ))}
          </Grid>
        </>
      )}

      <div className={layout.center}>
        <Stack direction={"row"} spacing={3}>
          {!user.signedIn && <LoginButton />}

          <Link href={"/election"} passHref>
            <Button variant={"outlined"} startIcon={<HowToVote />}>
              View All Elections
            </Button>
          </Link>
        </Stack>
      </div>
    </Container>
  );
}

export default withApollo(Home);
