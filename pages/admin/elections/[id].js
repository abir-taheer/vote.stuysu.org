import AdminRequired from "../../../comps/auth/AdminRequired";
import layout from "./../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import { useRouter } from "next/router";

const ManageElection = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Admin Panel
          </Typography>
          <AdminTabBar />
        </main>
      </div>
    </AdminRequired>
  );
};

export default ManageElection;
