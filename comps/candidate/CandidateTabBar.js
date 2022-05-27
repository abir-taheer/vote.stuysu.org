import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import ReportProblemOutlined from "@mui/icons-material/ReportProblemOutlined";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const tabs = [
  {
    path: "/election/[url]/candidate/[candidateUrl]",
    label: "About",
    exact: true,
    isManager: null,
    electionCompleted: null,
    active: null,
    icon: <PeopleOutlined />,
    strikes: null,
  },
  {
    path: "/election/[url]/candidate/[candidateUrl]/strike",
    label: "Strikes",
    exact: true,
    isManager: null,
    electionCompleted: null,
    active: null,
    icon: <ReportProblemOutlined />,
    strikes: true,
  },
  {
    path: "/election/[url]/candidate/[candidateUrl]/manage",
    label: "Manage",
    exact: false,
    isManager: true,
    electionCompleted: false,
    active: true,
    icon: <ManageAccountsOutlined />,
    strikes: null,
  },
];

const styles = {
  tabs: {
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

export default function CandidateTabBar({
  isManager,
  active,
  electionCompleted,
  strikes,
}) {
  const router = useRouter();
  const { url, candidateUrl } = router.query;

  const isMatch = (tab) =>
    tab.exact ? router.asPath === tab.path : router.asPath.startsWith(tab.path);

  const adjustedTabs = tabs
    .map((tab) => ({
      ...tab,
      path: tab.path
        .replace("[url]", url || "")
        .replace("[candidateUrl]", candidateUrl),
    }))
    .filter(
      (tab) =>
        (tab.isManager === null || tab.isManager === isManager) &&
        (tab.active === null || tab.active === active) &&
        (tab.electionCompleted === null ||
          tab.electionCompleted === electionCompleted) &&
        (tab.strikes === null || tab.strikes === !!strikes)
    );

  const tabIndex = adjustedTabs.findIndex(isMatch);

  const [value, setValue] = useState(tabIndex);

  useEffect(() => {
    setValue(tabIndex);
  }, [router, tabIndex]);

  if (adjustedTabs.length <= 1) {
    return null;
  }

  return (
    <div style={styles.container}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        sx={styles.tabs}
        variant={"scrollable"}
        allowScrollButtonsMobile
        scrollButtons={"auto"}
      >
        {adjustedTabs.map((tab) => (
          <Tab
            label={tab.label}
            key={tab.path}
            onClick={() => router.push(tab.path)}
            icon={tab.icon}
            sx={styles.tab}
          />
        ))}
      </Tabs>
    </div>
  );
}
