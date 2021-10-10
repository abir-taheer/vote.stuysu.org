import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import HelpOutline from "@mui/icons-material/HelpOutline";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import HowToVoteOutlined from "@mui/icons-material/HowToVoteOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import useLogin from "../auth/useLogin";
import UserContext from "../auth/UserContext";
import styles from "./NavBar.module.css";

const NavDrawer = ({ open, setOpen }) => {
  const router = useRouter();
  const user = useContext(UserContext);
  const { signIn } = useLogin();

  const closeDrawer = () => setOpen(false);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor={"right"}>
      <List>
        <div className={styles.drawerHeading}>
          {!user.signedIn && (
            <div>
              <p>You're not signed in</p>
              <Button
                color={"primary"}
                variant={"outlined"}
                fullWidth
                onClick={signIn}
                startIcon={<LockOpenOutlined />}
              >
                Sign In
              </Button>
            </div>
          )}

          {user.signedIn && (
            <div>
              <p>
                You're signed in as: <b>{user.name}</b>
              </p>
              <p>
                Email: <b>{user.email}</b>
              </p>
              <p>
                Graduation Year: <b>{user.gradYear}</b>
              </p>
              <p>
                Grade: <b>{user.grade}</b>
              </p>
              <Button
                color={"primary"}
                variant={"outlined"}
                fullWidth
                onClick={user.logout}
                startIcon={<PowerSettingsNewOutlined />}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>

        <br />

        {user.signedIn && user.adminPrivileges && (
          <Link href={"/admin"}>
            <ListItem
              button
              selected={router.asPath.startsWith("/admin")}
              onClick={closeDrawer}
            >
              <ListItemIcon>
                <AccountTreeOutlined />
              </ListItemIcon>
              <ListItemText primary={"Admin Panel"} />
            </ListItem>
          </Link>
        )}

        <Link href={"/"}>
          <ListItem
            button
            selected={router.asPath === "/"}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <HomeOutlined />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
        </Link>

        <Link href={"/election"}>
          <ListItem
            button
            selected={router.asPath.startsWith("/election")}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <HowToVoteOutlined />
            </ListItemIcon>
            <ListItemText primary={"Elections"} />
          </ListItem>
        </Link>

        <Link href={"/faq"}>
          <ListItem
            button
            selected={router.asPath.startsWith("/faq")}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <HelpOutline />
            </ListItemIcon>
            <ListItemText primary={"FAQs"} />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default NavDrawer;
