import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";

const QUERY = gql`
  query($id: ObjectId!) {
    electionResults(election: { id: $id }) {
      ... on RunoffResult {
        rounds {
          number
          numVotes
          eliminatedCandidates {
            id
            name
            picture {
              resource {
                url
              }
            }
          }

          results {
            candidate {
              id
              name
              picture {
                resource {
                  url
                }
              }
            }
            eliminated
            percentage
            numVotes
          }
        }

        winner {
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
        totalVotes
        isTie
        numEligibleVoters
      }
    }
  }
`;

const RunoffResult = ({ id }) => {
  const { data } = useQuery(QUERY, { variables: { id } });
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default RunoffResult;
