import { gql, useQuery } from "@apollo/client";
import withApollo from "../../../comps/apollo/withApollo";

const QUERY = gql`
  query($url: NonEmptyString!) {
    electionByUrl(url: $url) {
      id
      name
      candidates(sort: random) {
        id
        name
        url
        picture {
          id
          resource {
            url
          }
        }
      }
    }
  }
`;

const ElectionCandidates = () => {
  const { data, loading } = useQuery(QUERY);
  return <div></div>;
};

export default withApollo({ ssr: true })(ElectionCandidates);
