import React, { useContext } from "react";
import UserContext from "./UserContext";
import { useRouter } from "next/router";
import Head from "next/head";
import layout from "./../../styles/layout.module.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import entryDenied from "../../img/entry-denied.svg";
import Link from "@material-ui/core/Link";
import Image from "next/image";

// Any url prefixed with /admin will be handled by this wrapper
export default function AdminWrapper({ children }) {
  const user = useContext(UserContext);
  const router = useRouter();

  const adminRequired = router.pathname.startsWith("/admin");

  const userIsAdmin = user.ready && user.adminPrivileges;

  if (!adminRequired || userIsAdmin) {
    return children;
  }

  if (!user.ready) {
    return (
      <>
        <Head>
          <title>Admin Panel | StuyBOE Voting Site</title>
          <meta
            property={"og:title"}
            content={"Admin Panel | StuyBOE Voting Site"}
          />

          <meta
            property={"og:description"}
            content={
              "Only admin users are allowed on this page. Please authenticate to continue."
            }
          />

          <meta
            property={"description"}
            content={
              "Only admin users are allowed on this page. Please authenticate to continue."
            }
          />
        </Head>
        <div className={layout.center}>
          <CircularProgress />
        </div>
      </>
    );
  }

  return (
    <Container maxWidth={"xs"} className={layout.page}>
      <Head>
        <title>Admin Panel | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={"Admin Panel | StuyBOE Voting Site"}
        />

        <meta
          property={"og:description"}
          content={
            "Only admin users are allowed on this page. Please authenticate to continue."
          }
        />

        <meta
          property={"description"}
          content={
            "Only admin users are allowed on this page. Please authenticate to continue."
          }
        />
      </Head>

      <div className={layout.center}>
        <Image
          height={300}
          width={264}
          src={entryDenied}
          alt={
            "Entry denied. Someone in front of a door holding their hand out"
          }
        />
      </div>

      <Typography variant={"h1"} align={"center"}>
        You need to be an admin to view this page
      </Typography>

      <Typography variant={"subtitle1"} align={"center"}>
        If this is a mistake or emergency, contact{" "}
        <Link href={"mailto:abir@taheer.me"} color={"secondary"}>
          abir@taheer.me
        </Link>
      </Typography>
    </Container>
  );
}