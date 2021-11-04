import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlined from "@mui/icons-material/HelpOutlineOutlined";
import HowToVoteOutlined from "@mui/icons-material/HowToVoteOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ReviewsOutlined from "@mui/icons-material/ReviewsOutlined";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const tabs = [
  {
    path: ["/admin/election", "/admin/candidate"],
    label: "Elections",
    icon: <HowToVoteOutlined />,
    href: "/admin/election",
  },
  {
    path: ["/admin/user"],
    label: "Users",
    icon: <AccountCircleOutlined />,
    href: "/admin/user",
  },
  {
    path: ["/admin/faq"],
    label: "FAQs",
    icon: <HelpOutlined />,
    href: "/admin/faq",
  },
  {
    path: ["/admin/announcement"],
    label: "Announcements",
    icon: <NotificationsActiveOutlinedIcon />,
    href: "/admin/announcement",
  },
  {
    path: ["/admin/approval"],
    label: "Approvals",
    icon: <ReviewsOutlined />,
    href: "/admin/approval",
  },
];

const getActiveTabIndex = (path) =>
  tabs.findIndex((tab) =>
    tab.path.some((activePath) => path.startsWith(activePath))
  );

const styles = {
  tabs: {
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

export default function AdminTabBar() {
  const { pathname, push } = useRouter();
  const previousPath = globalThis.sessionStorage?.getItem(
    "previous-admin-path"
  );

  const [value, setValue] = useState(
    previousPath ? getActiveTabIndex(previousPath) : getActiveTabIndex(pathname)
  );

  useEffect(() => {
    setValue(getActiveTabIndex(pathname));
    globalThis.sessionStorage?.setItem("previous-admin-path", pathname);
  }, [pathname]);

  return (
    <div style={styles.container}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        sx={styles.tabs}
        scrollButtons={"auto"}
        variant={"scrollable"}
        allowScrollButtonsMobile
      >
        {tabs.map((tab) => (
          <Tab
            label={tab.label}
            icon={tab.icon}
            onClick={() => push(tab.href)}
            key={tab.path.join(" ")}
            sx={styles.tab}
          />
        ))}
      </Tabs>
    </div>
  );
}
