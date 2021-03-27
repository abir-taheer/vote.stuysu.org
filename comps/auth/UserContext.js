import { createContext } from "react";

export const defaultUserContextValue = {
  signedIn: false,
  user: null,
  refetch: () => {},
  logout: () => {},
};

const UserContext = createContext(defaultUserContextValue);

export default UserContext;
