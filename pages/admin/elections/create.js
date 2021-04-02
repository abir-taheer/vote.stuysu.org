import React from "react";
import AdminRequired from "../../../comps/auth/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";

import layout from "./../../../styles/layout.module.css";

const CreateElection = () => {
  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Create Election | Admin Panel
          </Typography>

          <AdminTabBar />
        </main>
      </div>
    </AdminRequired>
  );
};

export default CreateElection;
