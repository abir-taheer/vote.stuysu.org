import HowToVote from "@material-ui/icons/HowToVote";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Help from "@material-ui/icons/Help";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import styles from "./AdminTabBar.module.css";

const tabs = [
  {
    path: "/admin/elections",
    label: "Elections",
    icon: <HowToVote />,
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: <AccountCircle />,
  },
  {
    path: "/admin/faq",
    label: "FAQs",
    icon: <Help />,
  },
];

const AdminTabBar = () => {
  const router = useRouter();
  const tabIndex = tabs.findIndex((tab) => router.asPath.startsWith(tab.path));
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
          onClick={() => router.push(tab.path)}
          icon={tab.icon}
        />
      ))}
    </Tabs>
  );
};

export default AdminTabBar;
