import { gql, useQuery } from "@apollo/client";

const ID_QUERY = gql`
  query ($id: ObjectID!) {
    electionById(id: $id) {
      id
      name
      url
      picture {
        id
        alt
        resource {
          id
          url
        }
      }
      allowedGradYears
      type
      start
      end
      completed
      candidates {
        id
        name
        blurb
        active
        picture {
          id
          alt
          resource {
            id
            url
          }
        }
      }
    }
  }
`;

const useElectionById = (id) => {
  const { data, refetch, loading, error } = useQuery(ID_QUERY, {
    variables: { id },
  });

  return { election: data?.electionById, refetch, loading, error };
};

export default useElectionById;
