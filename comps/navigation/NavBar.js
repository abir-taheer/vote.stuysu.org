import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import styles from "./NavBar.module.css";

import { useContext, useState } from "react";
import NavDrawer from "./NavDrawer";
import { useRouter } from "next/router";
import Link from "next/link";
import useLogin from "../auth/useLogin";
import UserContext from "../auth/UserContext";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const { signIn, loading } = useLogin();
  const user = useContext(UserContext);

  const path = router.asPath;

  return (
    <>
      <NavDrawer open={drawerOpen} setOpen={setDrawerOpen} />

      <AppBar position="relative" className={styles.appBar} elevation={0}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" className={styles.title}>
            StuyBOE Voting Site
          </Typography>
          <div className={styles.menuLinks}>
            <Link href={"/"}>
              <Button
                disableRipple
                className={styles.menuItem}
                color={path === "/" ? "primary" : undefined}
              >
                Home
              </Button>
            </Link>
            <Link href={"/open"}>
              <Button
                disableRipple
                className={styles.menuItem}
                color={path === "/open" ? "primary" : undefined}
              >
                Open Elections
              </Button>
            </Link>

            <Link href={"/past"}>
              <Button
                disableRipple
                className={styles.menuItem}
                color={path === "/past" ? "primary" : undefined}
              >
                Past Elections
              </Button>
            </Link>

            <Link href={"/faq"}>
              <Button
                disableRipple
                className={styles.menuItem}
                color={path.startsWith("/faq") ? "primary" : undefined}
              >
                FAQs
              </Button>
            </Link>

            {!user.signedIn && (
              <Button
                disableRipple
                className={styles.menuItem}
                onClick={signIn}
                disabled={loading}
              >
                Login
              </Button>
            )}

            {user.signedIn && (
              <Button
                disableRipple
                className={styles.menuItem}
                onClick={user.logout}
              >
                Hi {user.firstName}!
              </Button>
            )}
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
