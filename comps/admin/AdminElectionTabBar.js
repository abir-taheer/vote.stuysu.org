import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  }, [router]);

  return (
    <div className={styles.center}>
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
    </div>
  );
};

export default AdminElectionTabBar;
