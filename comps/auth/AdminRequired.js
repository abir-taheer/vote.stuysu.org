import React, { useContext } from "react";
import UserContext from "./UserContext";
import AuthenticationRequired from "./AuthenticationRequired";
import entryDenied from "./../../img/entry-denied.svg";
import layout from "./../../styles/layout.module.css";
import Link from "@material-ui/core/Link";

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

            <h1 className={layout.title}>
              You need to be an admin to view this page
            </h1>

            <p>
              If this is a mistake or emergency, contact{" "}
              <Link href={"mailto:abir@taheer.me"} color={"secondary"}>
                abir@taheer.me
              </Link>
            </p>
          </main>
        </div>
      </AuthenticationRequired>
    );
  }

  return children;
};

export default AdminRequired;
