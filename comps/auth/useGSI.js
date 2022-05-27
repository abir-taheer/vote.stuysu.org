import { gql, useMutation } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../../constants";
import gaEvent from "../../utils/analytics/gaEvent";
import alertDialog from "../dialog/alertDialog";
import UserContext from "./UserContext";
import useScript from "./useScript";

const MUTATION = gql`
  mutation ($idToken: JWT!) {
    login(idToken: $idToken)
  }
`;

export default function useGSI() {
  const [ready, setReady] = useState(false);
  const scriptStatus = useScript("https://accounts.google.com/gsi/client");
  const [login, { loading }] = useMutation(MUTATION);
  const user = useContext(UserContext);

  const onSuccess = useCallback(
    async (tokenId) => {
      try {
        const response = await login({ variables: { idToken: tokenId } });
        const jwt = response.data.login;
        localStorage.setItem("auth-jwt", jwt);

        window.location.reload();
      } catch (e) {
        console.error(e);
        const error = e.graphQLErrors?.[0];
        const code = error?.extensions?.code;

        if (code === "UNKNOWN_USER") {
          await alertDialog({
            title: "There was an error authenticating you",
            body: `There's no user with that email in the database. \nIf you feel this is an error, please email stuyboe@gmail.com`,
          });
          gaEvent({
            category: "authentication",
            action: "error",
            label: "User not in database",
            nonInteraction: true,
          });
        } else {
          await alertDialog({
            title: "There was an error authenticating you",
            body: e.message,
          });
        }
      }
    },
    [login]
  );

  useEffect(() => {
    if (scriptStatus === "error") {
      alertDialog({
        title: "Error Logging in",
        body: "There was an error loading the library for logging in with Google. Make sure you don't have any content blockers enabled on this site.",
      });
      gaEvent({
        category: "authentication",
        action: "error",
        label: "GSI library failed to load",
        nonInteraction: true,
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
          gaEvent({
            category: "authentication",
            action: "error",
            label: "One tap prompt not displayed",
            nonInteraction: true,
          });
        } else {
          gaEvent({
            category: "authentication",
            action: "success",
            label: "One tap prompt displayed",
            nonInteraction: true,
          });
        }
      });
      setReady(true);
    }
  }, [scriptStatus, user, onSuccess]);

  return { ready, authenticating: loading };
}
