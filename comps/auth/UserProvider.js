import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import withApollo from "../apollo/withApollo";
import confirmDialog from "../dialog/confirmDialog";
import DateContext from "../shared/DateContext";
import UserContext from "./UserContext";

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
    adminPrivileges: false,
    firstName: null,
    lastName: null,
    email: null,
    gradYear: null,
    grade: null,
    ready: false,
  };

  if (!loading) {
    value.ready = true;
  }

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
      ready: true,
    });
  }

  return (
    <DateContext.Provider value={{ offset: dateOffset, getNow }}>
      <UserContext.Provider children={children} value={value} />
    </DateContext.Provider>
  );
};

export default withApollo(UserProvider);
