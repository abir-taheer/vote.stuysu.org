import BallotOutlined from "@mui/icons-material/BallotOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import GroupWorkOutlined from "@mui/icons-material/GroupWorkOutlined";
import HowToVoteOutlined from "@mui/icons-material/HowToVoteOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
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
  {
    path: "/election/[url]/audit",
    label: "Audit",
    exact: false,
    completed: true,
    showIfAdmin: null,
    icon: <VerifiedUserOutlined />,
  },
];

const styles = {
  tabs: {
    marginTop: "0.5rem",
    marginBottom: "2rem",
  },
  container: {
    justifyContent: "center",
    display: "flex",
  },
  tab: {
    minWidth: "8rem",
  },
};

export default function ElectionTabBar({ completed }) {
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

  const [value, setValue] = useState(
    typeof window === "undefined"
      ? tabIndex
      : parseInt(
          window.sessionStorage.getItem("previous-election-tab-value") || "0"
        )
  );

  useEffect(() => {
    setValue(tabIndex);
  }, [router, tabIndex]);

  return (
    <div style={styles.container}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        sx={styles.tabs}
        variant={"scrollable"}
      >
        {adjustedTabs.map((tab) => (
          <Tab
            label={tab.label}
            key={tab.path}
            onClick={(ev) => {
              window.sessionStorage.setItem(
                "previous-election-tab-value",
                value?.toString()
              );

              if (ev.ctrlKey || ev.metaKey) {
                window.open(tab.path);
              } else {
                router.push(tab.path);
              }

              gaEvent({
                category: "click",
                action: "navigation",
                label: tab.label,
                nonInteraction: false,
              });
            }}
            sx={styles.tab}
            icon={tab.icon}
          />
        ))}
      </Tabs>
    </div>
  );
}
