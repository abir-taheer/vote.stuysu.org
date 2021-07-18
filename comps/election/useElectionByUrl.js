import { gql, useQuery } from "@apollo/client";

const URL_QUERY = gql`
  query ($url: NonEmptyString!) {
    electionByUrl(url: $url) {
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

const useElectionByUrl = (url) => {
  const { data, refetch, error, loading } = useQuery(URL_QUERY, {
    variables: { url },
  });

  return { election: data?.electionByUrl, refetch, error, loading };
};

export default useElectionByUrl;
