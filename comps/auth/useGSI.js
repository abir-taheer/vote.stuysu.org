import { gql, useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../../constants";
import alertDialog from "../dialog/alertDialog";
import UserContext from "./UserContext";
import useScript from "./useScript";

const MUTATION = gql`
  mutation ($idToken: JWT!) {
    login(idToken: $idToken)
  }
`;

export default function useGSI(props = {}) {
  const { onLogin } = props;
  const [ready, setReady] = useState(false);
  const scriptStatus = useScript("https://accounts.google.com/gsi/client");
  const [login, { loading }] = useMutation(MUTATION);
  const user = useContext(UserContext);

  const onSuccess = async (tokenId) => {
    try {
      const response = await login({ variables: { idToken: tokenId } });
      const jwt = response.data.login;
      localStorage.setItem("auth-jwt", jwt);

      await user.refetch();

      if (onLogin) {
        await onLogin();
      }
    } catch (e) {
      console.error(e);
      const error = e.graphQLErrors?.[0];
      const code = error?.extensions?.code;

      if (code === "UNKNOWN_USER") {
        await alertDialog({
          title: "There was an error authenticating you",
          body: `There's no user with that email in the database. \nIf you feel this is an error, please email stuyboe@gmail.com`,
        });
      } else {
        await alertDialog({
          title: "There was an error authenticating you",
          body: e.message,
        });
      }
    }
  };

  useEffect(() => {
    if (scriptStatus === "error") {
      alertDialog({
        title: "Error Logging in",
        body: "There was an error loading the library for logging in with Google. Make sure you don't have any content blockers enabled on this site.",
      });
    }

    if (scriptStatus === "ready" && user.ready && !user.signedIn) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => onSuccess(credential),
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // continue with another identity provider.
          console.log("One Tap isn't supported in this browser");
        }
      });
      setReady(true);
    }
  }, [scriptStatus, user]);

  return { ready, authenticating: loading };
}
