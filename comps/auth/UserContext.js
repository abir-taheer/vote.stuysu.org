import { createContext } from "react";

export const defaultUserContextValue = {
  signedIn: false,
  refetch: () => {},
  logout: () => {},
  id: null,
  adminPrivileges: false,
  firstName: null,
  lastName: null,
  email: null,
  gradYear: null,
  grade: null,
  ready: false,
  candidatesManaged: null,
};

const UserContext = createContext(defaultUserContextValue);

export default UserContext;
