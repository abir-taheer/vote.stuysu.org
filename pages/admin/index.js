import AdminRequired from "../../comps/auth/AdminRequired";
import { gql, useQuery } from "@apollo/client";
import layout from "./../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import withApollo from "../../comps/apollo/withApollo";
import ElectionCard from "../../comps/election/ElectionCard";

const ELECTIONS_QUERY = gql`
  query {
    openElections {
      id
      name
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
  }
`;

function AdminPanel() {
  const { data } = useQuery(ELECTIONS_QUERY);

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"}>Admin Panel</Typography>
          <Typography variant={"h2"}>Select An Election</Typography>

          {data?.openElections.map(({ name, picture, id, start, end }) => (
            <ElectionCard
              name={name}
              picture={picture}
              key={id}
              start={start}
              end={end}
              href={"/admin/election/" + id}
            />
          ))}
        </main>
      </div>
    </AdminRequired>
  );
}

export default withApollo({ ssr: true })(AdminPanel);
