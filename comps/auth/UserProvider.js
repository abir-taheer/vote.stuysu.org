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
    refetch,
    logout,
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    gradYear: null,
    grade: null,
  };

  if (!loading && data?.authenticatedUser) {
    value.signedIn = true;

    const {
      id,
      firstName,
      lastName,
      email,
      gradYear,
      grade,
    } = data.authenticatedUser;

    Object.assign(value, { id, firstName, lastName, email, gradYear, grade });
  }

  return <UserContext.Provider children={children} value={value} />;
};

export default UserProvider;
