import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useRouter } from "next/router";

import { useContext, useEffect, useState } from "react";

import styles from "./ElectionTabBar.module.css";
import DashboardOutlined from "@material-ui/icons/DashboardOutlined";
import GroupWorkOutlined from "@material-ui/icons/GroupWorkOutlined";
import HowToVoteOutlined from "@material-ui/icons/HowToVoteOutlined";
import BallotOutlined from "@material-ui/icons/BallotOutlined";
import UserContext from "../auth/UserContext";

const tabs = [
  {
    path: "/election/[url]",
    label: "Overview",
    exact: true,
    // null or boolean value for filtering based on completion
    completed: null,
    showIfAdmin: null,
    icon: <DashboardOutlined />,
  },
  {
    path: "/election/[url]/candidate",
    label: "Candidates",
    exact: false,
    completed: null,
    showIfAdmin: null,
    icon: <GroupWorkOutlined />,
  },
  {
    path: "/election/[url]/result",
    label: "Results",
    exact: false,
    completed: true,
    showIfAdmin: true,
    icon: <BallotOutlined />,
  },
  {
    path: "/election/[url]/vote",
    label: "Vote",
    exact: false,
    completed: false,
    showIfAdmin: null,
    icon: <HowToVoteOutlined />,
  },
];

const ElectionTabBar = ({ completed }) => {
  const router = useRouter();
  const { url } = router.query;
  const { signedIn, adminPrivileges } = useContext(UserContext);

  const isMatch = (tab) =>
    tab.exact ? router.asPath === tab.path : router.asPath.startsWith(tab.path);

  const adjustedTabs = tabs
    .map((tab) => ({
      ...tab,
      path: tab.path.replace("[url]", url || ""),
    }))
    .filter(
      (tab) =>
        tab.completed === null ||
        tab.completed === completed ||
        isMatch(tab) ||
        (tab.showIfAdmin && signedIn && adminPrivileges)
    );

  const tabIndex = adjustedTabs.findIndex(isMatch);

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
      {adjustedTabs.map((tab) => (
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

export default ElectionTabBar;
