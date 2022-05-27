import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import HelpOutline from "@mui/icons-material/HelpOutline";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import HowToVoteOutlined from "@mui/icons-material/HowToVoteOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import useLogin from "../auth/useLogin";
import UserContext from "../auth/UserContext";

const styles = {
  heading: {
    padding: "0.5rem 1rem",
  },
};

const NavDrawer = ({ open, setOpen }) => {
  const router = useRouter();
  const user = useContext(UserContext);
  const { signIn } = useLogin();

  const closeDrawer = (ev) => {
    gaEvent({
      category: "click",
      action: "nav drawer link",
      label: ev.target?.innerText || "unknown button",
      nonInteraction: false,
    });
    setOpen(false);
  };

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor={"right"}>
      <List>
        <div style={styles.heading}>
          {!user.signedIn && (
            <div>
              <p>You&apos;re not signed in</p>
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
                You&apos;re signed in as: <b>{user.name}</b>
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
                onClick={() => {
                  gaEvent({
                    category: "authentication",
                    action: "signout",
                    label: "drawer",
                    nonInteraction: false,
                  });
                  user.logout();
                }}
                startIcon={<PowerSettingsNewOutlined />}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>

        <br />

        {user.signedIn && user.adminPrivileges && (
          <Link href={"/admin"} passHref>
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

        <Link href={"/"} passHref>
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

        {user.signedIn &&
          user.candidatesManaged
            ?.filter((c) => !c.election.completed)
            .map((candidate) => (
              <Link
                key={candidate.id}
                passHref
                href={`/election/${candidate.election.url}/candidate/${candidate.url}`}
              >
                <ListItem
                  button
                  selected={router.asPath.startsWith(
                    `/election/${candidate.election.url}/candidate/${candidate.url}`
                  )}
                  onClick={closeDrawer}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={candidate.picture.resource.url}
                      title={candidate.name}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={candidate.name} />
                </ListItem>
              </Link>
            ))}

        <Link href={"/election"} passHref>
          <ListItem
            button
            selected={
              router.asPath.startsWith("/election") &&
              !user.candidatesManaged?.some((candidate) =>
                router.asPath.startsWith(
                  `/election/${candidate.election.url}/candidate/${candidate.url}`
                )
              )
            }
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <HowToVoteOutlined />
            </ListItemIcon>
            <ListItemText primary={"Elections"} />
          </ListItem>
        </Link>

        <Link href={"/faq"} passHref>
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
