import UserContext from "./UserContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import confirmDialog from "../dialog/confirmDialog";
import withApollo from "../apollo/withApollo";
import { useEffect, useState } from "react";
import DateContext from "../shared/DateContext";

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

    date
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
  const [dateOffset, setDateOffset] = useState(0);

  useEffect(() => {
    if (data?.date) {
      const localTime = new Date();
      const serverTime = new Date(data.date);

      setDateOffset(serverTime.getTime() - localTime.getTime());
    }
  }, [data]);

  const getNow = () => new Date(Date.now() + dateOffset);

  const logout = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Signing Out",
      body: "Are you sure you want to sign out?",
    });

    if (confirmation) {
      window.localStorage.clear();
      await performLogout();
      window.location.reload();
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

  return (
    <DateContext.Provider value={{ offset: dateOffset, getNow }}>
      <UserContext.Provider children={children} value={value} />
    </DateContext.Provider>
  );
};

export default withApollo({ ssr: true })(UserProvider);
