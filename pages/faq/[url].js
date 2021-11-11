import { gql, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import EditOutlined from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import withApollo from "../../comps/apollo/withApollo";
import UserContext from "../../comps/auth/UserContext";
import BackButton from "../../comps/shared/BackButton";
import LoadingScreen from "../../comps/shared/LoadingScreen";
import useFormatDate from "../../utils/date/useFormatDate";
import Error404 from "../404";
import layout from "./../../styles/layout.module.css";

const QUERY = gql`
  query ($url: NonEmptyString!) {
    faqByUrl(url: $url) {
      id
      title
      url
      body
      plainTextBody
      updatedAt
    }
  }
`;

const styles = {
  divider: { width: 200, margin: "1rem auto" },
  editButton: {
    marginTop: "1rem",
  },
};

function FAQPage() {
  const router = useRouter();
  const { url } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { url } });
  const { getReadableDate } = useFormatDate(false);
  const user = useContext(UserContext);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!data?.faqByUrl) {
    return <Error404 />;
  }

  const faq = data?.faqByUrl;
  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>{faq.title} | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={`${faq.title} | StuyBOE Voting Site`}
        />
        <meta
          property="og:description"
          content={
            faq.plainTextBody.length < 100
              ? faq.plainTextBody
              : faq.plainTextBody.substr(0, 100) + "..."
          }
        />
        <meta
          property={"og:image"}
          content={"https://vote.stuysu.org/logo512.png"}
        />
        <meta property={"og:image:height"} content={512} />
        <meta property={"og:image:width"} content={512} />
        <meta property={"og:image:alt"} content={"Board of Elections Logo"} />
        <meta property="og:image:type" content="image/png" />
      </Head>

      <BackButton href={"/faq"} text={"Back To FAQs"} />
      <Typography variant={"h2"} color={"secondary"} align={"center"}>
        {faq.title}
      </Typography>
      <Typography
        variant={"subtitle2"}
        color={"text.secondary"}
        align={"center"}
      >
        Updated {getReadableDate(faq.updatedAt)}
      </Typography>

      {user.adminPrivileges && (
        <div className={layout.center}>
          <Link href={"/admin/faq/" + faq.id} passHref>
            <Button
              variant={"outlined"}
              startIcon={<EditOutlined />}
              sx={styles.editButton}
              color={"secondary"}
            >
              Edit This FAQ
            </Button>
          </Link>
        </div>
      )}

      <Divider sx={styles.divider} />

      <div
        className="sanitized-html"
        dangerouslySetInnerHTML={{ __html: faq.body }}
      />
    </Container>
  );
}

export default withApollo(FAQPage, { getDataFromTree });
