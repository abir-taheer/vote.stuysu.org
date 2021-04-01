import React, { useContext } from "react";
import UserContext from "./UserContext";
import AuthenticationRequired from "./AuthenticationRequired";
import entryDenied from "./../../img/entry-denied.svg";
import layout from "./../../styles/layout.module.css";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

const AdminRequired = ({ children }) => {
  const user = useContext(UserContext);

  if (!user.adminPrivileges) {
    return (
      <AuthenticationRequired>
        <div className={layout.container}>
          <main className={layout.main}>
            <img
              className={layout.largeVector}
              src={entryDenied}
              alt={
                "Entry denied. Someone in front of a door holding their hand out"
              }
            />

            <Typography variant={"h1"} align={"center"}>
              You need to be an admin to view this page
            </Typography>

            <Typography variant={"subtitle1"} align={"center"}>
              If this is a mistake or emergency, contact{" "}
              <Link href={"mailto:abir@taheer.me"} color={"secondary"}>
                abir@taheer.me
              </Link>
            </Typography>
          </main>
        </div>
      </AuthenticationRequired>
    );
  }

  return children;
};

export default AdminRequired;
