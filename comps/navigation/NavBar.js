import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import useLogin from "../auth/useLogin";
import UserContext from "../auth/UserContext";
import styles from "./NavBar.module.css";
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

      <AppBar position="relative" className={styles.appBar} elevation={0}>
        <Toolbar className={styles.toolbar}>
          <Link href={"/"}>
            <Typography variant="h6" className={styles.title}>
              StuyBOE Voting Site
            </Typography>
          </Link>

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

            {user.signedIn && user.adminPrivileges && (
              <Link href={"/admin/election"}>
                <Button
                  disableRipple
                  className={styles.menuItem}
                  color={path.startsWith("/admin") ? "primary" : undefined}
                >
                  Admin Panel
                </Button>
              </Link>
            )}

            <Link href={"/election"}>
              <Button
                disableRipple
                className={styles.menuItem}
                color={path.startsWith("/election") ? "primary" : undefined}
              >
                Elections
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
