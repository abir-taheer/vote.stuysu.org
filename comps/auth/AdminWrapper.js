import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import entryDenied from "../../img/entry-denied.svg";
import gaEvent from "../../utils/analytics/gaEvent";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import layout from "./../../styles/layout.module.css";
import UserContext from "./UserContext";

// Any url prefixed with /admin will be handled by this wrapper
export default function AdminWrapper({ children }) {
  const user = useContext(UserContext);
  const router = useRouter();

  const adminRequired = router.pathname.startsWith("/admin");

  const userIsAdmin = user.ready && user.adminPrivileges;

  useEffect(() => {
    if (adminRequired && user.ready && !user.adminPrivileges) {
      gaEvent({
        category: "navigation",
        action: user.signedIn
          ? "authenticated non-admin request"
          : "unauthenticated admin request",
        label: "non admin visited admin page",
        nonInteraction: false,
      });
    }
  }, [adminRequired, user?.signedIn, user?.adminPrivileges, user?.ready]);

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
        <CenteredCircularProgress />
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
