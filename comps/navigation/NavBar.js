import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import LoadingButton from "@mui/lab/LoadingButton";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import useLogin from "../auth/useLogin";
import UserContext from "../auth/UserContext";
import NavBarButton from "./NavBarButton";
import NavDrawer from "./NavDrawer";
import UserMenuItem from "./UserMenuItem";

const styles = {
  appBar: {
    display: "flex",
    maxWidth: 1200,
    margin: "auto",
  },
  title: {
    flexGrow: 1,
  },
  tabs: {
    // Only show if screen is larger than 850px
    "@media (max-width: 850px)": {
      display: "none",
    },
  },
  menuIcon: {
    // Only show the menu button if screen is smaller than 851px
    "@media (min-width: 851px)": {
      display: "none",
    },
  },
};

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const path = router.asPath;

  const { signIn, loading } = useLogin();

  const user = useContext(UserContext);

  return (
    <>
      <NavDrawer open={drawerOpen} setOpen={setDrawerOpen} />

      <AppBar
        position="relative"
        sx={styles.appBar}
        elevation={0}
        color={"transparent"}
      >
        <Toolbar>
          <Link href={"/"} passHref>
            <Typography variant="h6" sx={styles.title}>
              StuyBOE Voting Site
            </Typography>
          </Link>

          <Stack spacing={2} direction={"row"} sx={styles.tabs}>
            <NavBarButton href={"/"} label={"Home"} active={path === "/"} />

            {user.signedIn &&
              user.candidatesManaged
                ?.filter((c) => !c.election.completed)
                .map((candidate) => (
                  <NavBarButton
                    key={candidate.id}
                    href={
                      "/election/" +
                      candidate.election.url +
                      "/candidate/" +
                      candidate.url
                    }
                    active={path.startsWith(
                      "/election/" +
                        candidate.election.url +
                        "/candidate/" +
                        candidate.url
                    )}
                    label={candidate.name}
                  />
                ))}

            {user.signedIn && user.adminPrivileges && (
              <NavBarButton
                href={"/admin"}
                active={path.startsWith("/admin")}
                label={"Admin Panel"}
              />
            )}

            <NavBarButton
              href={"/election"}
              active={
                path.startsWith("/election") &&
                !user.candidatesManaged?.some((candidate) =>
                  path.startsWith(
                    `/election/${candidate.election.url}/candidate/${candidate.url}`
                  )
                )
              }
              label={"Elections"}
            />

            <NavBarButton
              href={"/faq"}
              active={path.startsWith("/faq")}
              label={"FAQs"}
            />

            {!user.signedIn && (
              <LoadingButton
                disableRipple
                onClick={signIn}
                sx={{ color: "black" }}
                loading={loading || !user.ready}
                loadingPosition={"start"}
                startIcon={<LockOpenOutlined />}
              >
                Login
              </LoadingButton>
            )}

            {user.signedIn && <UserMenuItem />}
          </Stack>
          <IconButton
            sx={styles.menuIcon}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
