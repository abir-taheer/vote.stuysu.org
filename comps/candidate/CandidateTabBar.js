import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import styles from "./CandidateTabBar.module.css";
import PeopleOutlined from "@material-ui/icons/PeopleOutlined";
import QuestionAnswerOutlined from "@material-ui/icons/QuestionAnswerOutlined";
import ReportProblemOutlined from "@material-ui/icons/ReportProblemOutlined";
import BuildOutlined from "@material-ui/icons/BuildOutlined";

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
  // {
  //   path: "/election/[url]/candidate/[candidateUrl]/q-a",
  //   label: "Q & A",
  //   exact: false,
  //   isManager: null,
  //   electionCompleted: null,
  //   active: null,
  //   icon: <QuestionAnswerOutlined />,
  // },
  // {
  //   path: "/election/[url]/candidate/[candidateUrl]/strike",
  //   label: "Strikes",
  //   exact: false,
  //   isManager: null,
  //   electionCompleted: null,
  //   active: null,
  //   icon: <ReportProblemOutlined />,
  // },
  //
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
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      className={styles.tabs}
      centered
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
}
