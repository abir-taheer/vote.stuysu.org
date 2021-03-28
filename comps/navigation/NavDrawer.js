import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import Link from "next/link";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import ArchiveOutlined from "@material-ui/icons/ArchiveOutlined";
import HowToVoteOutlined from "@material-ui/icons/HowToVoteOutlined";
import HelpOutline from "@material-ui/icons/HelpOutline";
import LockOpenOutlined from "@material-ui/icons/LockOpenOutlined";
import { useRouter } from "next/router";

const NavDrawer = ({ open, setOpen }) => {
  const router = useRouter();

  console.log(router);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor={"right"}>
      <List>
        <ListItem button>
          <ListItemIcon>
            <LockOpenOutlined />
          </ListItemIcon>
          <ListItemText primary={"Login"} />
        </ListItem>
        <br />

        <Link href={"/"}>
          <ListItem button selected={router.asPath === "/"}>
            <ListItemIcon>
              <HomeOutlined />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
        </Link>

        <Link href={"/open"}>
          <ListItem button selected={router.asPath === "/open"}>
            <ListItemIcon>
              <HowToVoteOutlined />
            </ListItemIcon>
            <ListItemText primary={"Open Elections"} />
          </ListItem>
        </Link>

        <Link href={"/past"}>
          <ListItem button selected={router.asPath === "/past"}>
            <ListItemIcon>
              <ArchiveOutlined />
            </ListItemIcon>
            <ListItemText primary={"Past Elections"} />
          </ListItem>
        </Link>

        <Link href={"/faq"}>
          <ListItem button selected={router.asPath.startsWith("/faq")}>
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
