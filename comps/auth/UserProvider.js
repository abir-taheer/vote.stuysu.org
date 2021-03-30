import UserContext from "./UserContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import confirmDialog from "../dialog/confirmDialog";

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
      adminPrivileges
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
    const confirmation = await confirmDialog({
      title: "Confirm Signing Out",
      body: "Are you sure you want to sign out?",
    });

    if (confirmation) {
      window.localStorage.clear();
      await performLogout();
      await refetch();
    }
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
      name,
      firstName,
      lastName,
      email,
      gradYear,
      grade,
      adminPrivileges,
    } = data.authenticatedUser;

    Object.assign(value, {
      id,
      name,
      firstName,
      lastName,
      email,
      gradYear,
      grade,
      adminPrivileges,
    });
  }

  return <UserContext.Provider children={children} value={value} />;
};

export default UserProvider;
