import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";

import styles from "./AdminElectionTabBar.module.css";

const tabs = [
  {
    path: "/admin/election/[id]",
    label: "Info",
    exact: true,
  },
  {
    path: "/admin/election/[id]/candidate",
    label: "Candidates",
    exact: false,
  },
  {
    path: "/admin/election/[id]/posts",
    label: "Posts",
    exact: false,
  },
];

const AdminElectionTabBar = () => {
  const router = useRouter();
  const { id } = router.query;

  const adjustedTabs = tabs.map((tab) => ({
    ...tab,
    path: tab.path.replace("[id]", id || ""),
  }));

  const tabIndex = adjustedTabs.findIndex((tab) =>
    tab.exact ? router.asPath === tab.path : router.asPath.startsWith(tab.path)
  );

  const [value, setValue] = useState(tabIndex);

  useEffect(() => {
    setValue(tabIndex);
    console.log(tabIndex);
  }, [router]);

  return (
    <Paper className={styles.paper}>
      <Tabs value={value} indicatorColor="secondary" textColor="secondary">
        {adjustedTabs.map((tab) => (
          <Tab
            label={tab.label}
            key={tab.path}
            onClick={() => router.push(tab.path)}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default AdminElectionTabBar;
