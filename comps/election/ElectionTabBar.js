import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import styles from "./ElectionTabBar.module.css";

const tabs = [
  {
    path: "/election/[url]",
    label: "Overview",
    exact: true,
    // null or boolean value for filtering based on completion
    completed: null,
  },
  {
    path: "/election/[url]/candidate",
    label: "Candidates",
    exact: false,
    completed: null,
  },
  {
    path: "/election/[url]/result",
    label: "Results",
    exact: false,
    completed: true,
  },
  {
    path: "/election/[url]/vote",
    label: "Vote",
    exact: false,
    completed: false,
  },
];

const ElectionTabBar = ({ completed }) => {
  const router = useRouter();
  const { url } = router.query;

  const isMatch = (tab) =>
    tab.exact ? router.asPath === tab.path : router.asPath.startsWith(tab.path);

  const adjustedTabs = tabs
    .map((tab) => ({
      ...tab,
      path: tab.path.replace("[url]", url || ""),
    }))
    .filter(
      (tab) =>
        tab.completed === null || tab.completed === completed || isMatch(tab)
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
