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
  },
  {
    path: "/admin/election/[id]/candidates",
    label: "Candidates",
  },
  {
    path: "/admin/election/[id]/posts",
    label: "Posts",
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
    router.asPath.startsWith(tab.path)
  );
  const [value, setValue] = useState(tabIndex);

  useEffect(() => {
    setValue(tabIndex);
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
