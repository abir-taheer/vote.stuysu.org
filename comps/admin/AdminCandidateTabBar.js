import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./AdminElectionTabBar.module.css";

const tabs = [
  {
    path: "/admin/candidate/[id]",
    label: "Info",
    exact: true,
  },
  {
    path: "/admin/candidate/[id]/approval",
    label: "Approvals",
    exact: false,
  },
  {
    path: "/admin/candidate/[id]/strike",
    label: "Strikes",
    exact: false,
  },
];

const AdminCandidateTabBar = () => {
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
        <Tabs
          value={value}
          indicatorColor="secondary"
          textColor="secondary"
          variant={"scrollable"}
          scrollButtons={"auto"}
          allowScrollButtonsMobile
          centered
        >
          {adjustedTabs.map((tab) => (
            <Tab
              label={tab.label}
              key={tab.path}
              onClick={() => router.push(tab.path)}
              sx={{ minWidth: "8rem" }}
            />
          ))}
        </Tabs>
      </Paper>
    </div>
  );
};

export default AdminCandidateTabBar;
