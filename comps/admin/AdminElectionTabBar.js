import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
];

const styles = {
  paper: {
    marginTop: "0.5rem",
    marginBottom: "2rem",
  },
  container: {
    display: "flex",
    justifyContent: "center",
  },
  tab: {
    minWidth: "8rem",
  },
};

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
    <div style={styles.container}>
      <Paper sx={styles.paper}>
        <Tabs
          value={value}
          indicatorColor="secondary"
          textColor="secondary"
          scrollButtons={"auto"}
          variant={"scrollable"}
          allowScrollButtonsMobile
        >
          {adjustedTabs.map((tab) => (
            <Tab
              label={tab.label}
              key={tab.path}
              onClick={() => router.push(tab.path)}
              sx={styles.tab}
            />
          ))}
        </Tabs>
      </Paper>
    </div>
  );
};

export default AdminElectionTabBar;
