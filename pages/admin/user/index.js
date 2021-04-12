import AdminRequired from "../../../comps/auth/AdminRequired";
import layout from "../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";

const UserIndex = () => {
  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Users | Admin Panel
          </Typography>
          <AdminTabBar />
        </main>
      </div>
    </AdminRequired>
  );
};

export default UserIndex;
