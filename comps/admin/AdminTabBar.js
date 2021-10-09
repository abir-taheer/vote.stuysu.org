import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlined from "@mui/icons-material/HelpOutlineOutlined";
import HowToVoteOutlined from "@mui/icons-material/HowToVoteOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./AdminTabBar.module.css";

const tabs = [
  {
    path: ["/admin/election", "/admin/candidate"],
    label: "Elections",
    icon: <HowToVoteOutlined />,
    href: "/admin/election",
  },
  {
    path: ["/admin/user"],
    label: "Users",
    icon: <AccountCircleOutlined />,
    href: "/admin/user",
  },
  {
    path: ["/admin/faq"],
    label: "FAQs",
    icon: <HelpOutlined />,
    href: "/admin/faq",
  },
  {
    path: ["/admin/announcement"],
    label: "Announcements",
    icon: <NotificationsActiveOutlinedIcon />,
    href: "/admin/announcement",
  },
];

const getActiveTabIndex = (path) =>
  tabs.findIndex((tab) =>
    tab.path.some((activePath) => path.startsWith(activePath))
  );

export default function AdminTabBar() {
  const { pathname, push } = useRouter();
  const previousPath = globalThis.sessionStorage?.getItem(
    "previous-admin-path"
  );

  const [value, setValue] = useState(
    previousPath ? getActiveTabIndex(previousPath) : getActiveTabIndex(pathname)
  );

  useEffect(() => {
    setValue(getActiveTabIndex(pathname));
    globalThis.sessionStorage?.setItem("previous-admin-path", pathname);
  }, [pathname]);

  return (
    <div className={styles.center}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        className={styles.tabs}
        scrollButtons={"on"}
        variant={"scrollable"}
      >
        {tabs.map((tab) => (
          <Tab
            label={tab.label}
            icon={tab.icon}
            onClick={() => push(tab.href)}
            key={tab.path.join(" ")}
          />
        ))}
      </Tabs>
    </div>
  );
}
