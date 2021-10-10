import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import QuestionAnswerOutlined from "@mui/icons-material/QuestionAnswerOutlined";
import ReportProblemOutlined from "@mui/icons-material/ReportProblemOutlined";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./CandidateTabBar.module.css";

const tabs = [
  {
    path: "/election/[url]/candidate/[candidateUrl]",
    label: "About",
    exact: true,
    isManager: null,
    electionCompleted: null,
    active: null,
    icon: <PeopleOutlined />,
  },
  {
    path: "/election/[url]/candidate/[candidateUrl]/q-a",
    label: "Q & A",
    exact: false,
    isManager: null,
    electionCompleted: null,
    active: null,
    icon: <QuestionAnswerOutlined />,
  },
  {
    path: "/election/[url]/candidate/[candidateUrl]/strike",
    label: "Strikes",
    exact: false,
    isManager: null,
    electionCompleted: null,
    active: null,
    icon: <ReportProblemOutlined />,
  },
  {
    path: "/election/[url]/candidate/[candidateUrl]/manage",
    label: "Manage",
    exact: false,
    isManager: null,
    electionCompleted: null,
    active: true,
    icon: <ManageAccountsOutlined />,
  },
];

export default function CandidateTabBar({
  isManager,
  active,
  electionCompleted,
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
          tab.electionCompleted === electionCompleted)
    );

  const tabIndex = adjustedTabs.findIndex(isMatch);

  const [value, setValue] = useState(tabIndex);

  useEffect(() => {
    setValue(tabIndex);
  }, [router]);

  return (
    <div className={styles.center}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        className={styles.tabs}
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
            sx={{ minWidth: "8rem" }}
          />
        ))}
      </Tabs>
    </div>
  );
}
