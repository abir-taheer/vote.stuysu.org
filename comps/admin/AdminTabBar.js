import AccountCircleOutlined from "@material-ui/icons/AccountCircleOutlined";
import HowToVoteOutlined from "@material-ui/icons/HowToVoteOutlined";
import HelpOutlined from "@material-ui/icons/HelpOutlineOutlined";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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

const AdminTabBar = () => {
  const router = useRouter();
  const tabIndex = tabs.findIndex((tab) =>
    tab.path.some((path) => router.asPath.startsWith(path))
  );
  const [value, setValue] = useState(tabIndex);

  useEffect(() => {
    setValue(tabIndex);
  }, [router]);

  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      className={styles.tabs}
    >
      {tabs.map((tab) => (
        <Tab
          label={tab.label}
          key={tab.path}
          onClick={() => router.push(tab.href)}
          icon={tab.icon}
        />
      ))}
    </Tabs>
  );
};

export default AdminTabBar;
