import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import LoadingButton from "@mui/lab/LoadingButton";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import useLogin from "../auth/useLogin";
import UserContext from "../auth/UserContext";
import styles from "./NavBar.module.css";
import NavBarButton from "./NavBarButton";
import NavDrawer from "./NavDrawer";
import UserMenuItem from "./UserMenuItem";

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
        className={styles.appBar}
        elevation={0}
        color={"transparent"}
      >
        <Toolbar className={styles.toolbar}>
          <Link href={"/"}>
            <Typography variant="h6" className={styles.title}>
              StuyBOE Voting Site
            </Typography>
          </Link>

          <div className={styles.menuLinks}>
            <NavBarButton href={"/"} label={"Home"} active={path === "/"} />

            {user.signedIn && user.adminPrivileges && (
              <NavBarButton
                href={"/admin"}
                active={path.startsWith("/admin")}
                label={"Admin Panel"}
              />
            )}

            <NavBarButton
              href={"/election"}
              active={path.startsWith("/election")}
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
          </div>
          <IconButton
            className={styles.menuButton}
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
