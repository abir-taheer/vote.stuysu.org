import { createContext } from "react";

export const defaultUserContextValue = {
  signedIn: false,
  refetch: () => {},
  logout: () => {},
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  gradYear: null,
  grade: null,

};

const UserContext = createContext(defaultUserContextValue);

export default UserContext;
