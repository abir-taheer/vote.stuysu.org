import UserContext, { defaultUserContextValue } from "./UserContext";
import { gql, useMutation, useQuery } from "@apollo/client";

const QUERY = gql`
  query {
    authenticatedUser {
      id
      name
      email
      firstName
      lastName
      gradYear
      grade
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

const UserProvider = ({ children }) => {
  const { data, loading, refetch } = useQuery(QUERY);
  const [performLogout] = useMutation(LOGOUT_MUTATION);

  const logout = async () => {
    window.localStorage.clear();
    await performLogout();
    await refetch();
  };

  const value = {
    signedIn: false,
    user: null,
    refetch,
    logout,
  };

  if (!loading && data?.authenticatedUser) {
    value.signedIn = true;
    value.user = data.authenticatedUser;
  }

  return <UserContext.Provider children={children} value={value} />;
};

export default UserProvider;
