import layout from "./../../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import { gql } from "@apollo/client/core";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Error404 from "../../../404";

const QUERY = gql`
  query($id: ObjectId!, $pageReady: Boolean!) {
    userById(id: $id) @include(if: $pageReady) {
      id
      firstName
      lastName
      email
      gradYear
      adminPrivileges
    }
  }
`;

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query;

  const pageReady = !!id;
  const { data, loading } = useQuery(QUERY, { variables: { id, pageReady } });

  const user = data?.userById;
  if (pageReady && !loading && !user) {
    return <Error404 />;
  }

  return (
    <div className={layout.container}>
      <main className={layout.main}>
        <Typography variant={"h1"}>Edit User | Admin Panel</Typography>

        <AdminTabBar />
      </main>
    </div>
  );
};

export default EditUser;
