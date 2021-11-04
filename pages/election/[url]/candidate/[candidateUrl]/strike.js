import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import WarningOutlined from "@mui/icons-material/WarningOutlined";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment } from "react";
import withApollo from "../../../../../comps/apollo/withApollo";
import CandidateNotFound from "../../../../../comps/candidate/CandidateNotFound";
import CandidateTabBar from "../../../../../comps/candidate/CandidateTabBar";
import ElectionNotFound from "../../../../../comps/election/ElectionNotFound";
import BackButton from "../../../../../comps/shared/BackButton";
import LoadingScreen from "../../../../../comps/shared/LoadingScreen";
import layout from "../../../../../styles/layout.module.css";
import useFormatDate from "../../../../../utils/date/useFormatDate";

const QUERY = gql`
  query ($electionUrl: NonEmptyString!, $candidateUrl: NonEmptyString!) {
    candidateByUrl(url: $candidateUrl, election: { url: $electionUrl }) {
      id
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
      active
      isManager
      strikes {
        id
        reason
        weight
        updatedAt
      }
      totalStrikes
    }
    electionByUrl(url: $electionUrl) {
      id
      name
      url
      completed
    }
  }
`;

function CandidateStrikesPage() {
  const router = useRouter();
  const { url, candidateUrl } = router.query;
  const { getReadableDate } = useFormatDate(false);

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

  const title = `Strikes - ${candidate.name} | StuyBOE Voting Site`;
  // Now that both election and candidate are defined we can do whatever
  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>{title}</title>
        <meta property={"og:title"} content={title} />
        <meta
          property={"description"}
          content={
            "Strikes given to candidate: " +
            candidate.name +
            " for " +
            election.name
          }
        />
        <meta
          property="og:description"
          content={
            "Strikes given to candidate: " +
            candidate.name +
            " for " +
            election.name
          }
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
          color={"text.secondary"}
          align={"center"}
          className={layout.spaced}
        >
          Candidate has{" "}
          <Typography
            variant={"inherit"}
            component={"span"}
            color={candidate.totalStrikes > 0 ? "error" : "secondary"}
          >
            {candidate.totalStrikes}
          </Typography>{" "}
          strike{candidate.totalStrikes === 1 ? "" : "s"}
        </Typography>
      </div>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {candidate.strikes.map((strike, index) => (
          <Fragment key={strike.id}>
            <ListItem>
              <ListItemIcon>
                <WarningOutlined />
              </ListItemIcon>
              <ListItemText>
                <Typography variant={"h3"} color={"primary"}>
                  <b>{getReadableDate(strike.updatedAt)}</b>
                </Typography>

                <Typography variant="body1" gutterBottom>
                  Weight:{" "}
                  <Typography component="span" variant="inherit" color="error">
                    {strike.weight}
                  </Typography>
                </Typography>
                <Typography variant="body1" component={"span"}>
                  Reason:{" "}
                  <Typography
                    variant="body1"
                    component={"span"}
                    color={"text.secondary"}
                  >
                    {strike.reason}
                  </Typography>
                </Typography>
              </ListItemText>
            </ListItem>

            {index < candidate.strikes.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </Container>
  );
}

export default withApollo(CandidateStrikesPage, { getDataFromTree });
