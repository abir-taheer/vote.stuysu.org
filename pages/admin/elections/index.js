import AdminRequired from "../../../comps/auth/AdminRequired";
import layout from "../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import { gql, useQuery } from "@apollo/client";
import withApollo from "../../../comps/apollo/withApollo";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Link from "next/link";

import ElectionCardGrid from "../../../comps/election/ElectionCardGrid";

const ELECTIONS_QUERY = gql`
  query {
    openElections {
      id
      name
      url
      start
      end
      picture {
        id
        resource {
          id
          url
          width
          height
        }
        alt
      }
    }

    pastElections {
      id
      name
      start
      url
      end
      picture {
        id
        resource {
          id
          url
          width
          height
        }
        alt
      }
    }
  }
`;

const AdminElections = () => {
  const { data } = useQuery(ELECTIONS_QUERY);

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"}>Elections | Admin Panel</Typography>
          <AdminTabBar />

          <Link href={"/admin/elections/create"}>
            <Button
              startIcon={<Add />}
              variant={"outlined"}
              color={"secondary"}
            >
              Create Election
            </Button>
          </Link>

          <Typography variant={"h2"}>Manage Open Elections</Typography>

          <ElectionCardGrid elections={data?.openElections} admin />

          <Typography variant={"h2"}>View Past Elections</Typography>
          <ElectionCardGrid elections={data?.pastElections} admin />
        </main>
      </div>
    </AdminRequired>
  );
};

export default withApollo({ ssr: false })(AdminElections);
