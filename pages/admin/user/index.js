import AdminRequired from "../../../comps/auth/AdminRequired";
import layout from "../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Button from "@material-ui/core/Button";
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client";
import alertDialog from "../../../comps/dialog/alertDialog";

const SYNC_MUTATION = gql`
  mutation {
    syncUsersWithStuyActivities {
      totalUsersCreated
      completedAt
    }
  }
`;

const UserIndex = () => {
  const [sync, { loading: loadingSync }] = useMutation(SYNC_MUTATION);

  const handleSync = async () => {
    try {
      const { data } = await sync();

      alertDialog({
        title: "Successfully synced users",
        body: `The sync was successful, ${data.syncUsersWithStuyActivities.totalUsersCreated} new users were added.`,
      });
    } catch (e) {
      alertDialog({
        title: "Error Syncing Users",
        body: "There was an error: " + e.message,
      });
    }
  };

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Users | Admin Panel
          </Typography>
          <AdminTabBar />
          <Typography variant={"h2"}>StuyActivities Sync</Typography>
          <Typography paragraph>
            This will import new students from StuyActivities.
          </Typography>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={handleSync}
            disabled={loadingSync}
          >
            Sync Users
          </Button>
        </main>
      </div>
    </AdminRequired>
  );
};

export default UserIndex;
