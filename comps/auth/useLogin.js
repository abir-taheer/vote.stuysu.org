import { gql, useMutation } from "@apollo/client";
import { useContext, useEffect, useRef } from "react";
import UserContext from "./UserContext";
import alertDialog from "../dialog/alertDialog";
import layout from "./../../styles/layout.module.css";

import { GOOGLE_CLIENT_ID } from "../../constants";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import useScript from "./useScript";
import LoginButton from "./LoginButton";
import { CircularProgress } from "@material-ui/core";

const MUTATION = gql`
  mutation ($idToken: JWT!) {
    login(idToken: $idToken)
  }
`;

const useLogin = (props = {}) => {
  const scriptStatus = useScript("https://accounts.google.com/gsi/client");
  const [login, { loading }] = useMutation(MUTATION);
  const user = useContext(UserContext);

  useEffect(() => {
    if (scriptStatus === "error") {
      window.alert(
        "There was an error loading the library for logging in with Google. Make sure you don't have any content blockers enabled on this site."
      );
    }

    if (scriptStatus === "ready") {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => onSuccess(credential),
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // continue with another identity provider.
          console.log("One Tap isn't supported in this browser");
        }
      });
    }
  }, [scriptStatus]);

  const onSuccess = async (tokenId) => {
    try {
      const response = await login({ variables: { idToken: tokenId } });
      const jwt = response.data.login;
      localStorage.setItem("auth-jwt", jwt);

      await user.refetch();

      if (props.onLogin) {
        await props.onLogin();
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

  const signIn = () => {
    {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // continue with another identity provider.
          console.log("One Tap isn't supported in this browser");
          alertDialog({
            title: "Logging in",
            body: (
              <div>
                <Typography variant={"body1"}>
                  This app uses{" "}
                  <Link
                    href={"https://developers.google.com/identity/gsi/web"}
                    target={"_blank"}
                    color={"secondary"}
                  >
                    Google Sign In (GSI)
                  </Link>{" "}
                  to sign you in and only requests the basic profile scope.
                </Typography>
                <Typography variant={"body1"}>
                  Click the "Sign In With Google" button on the below and sign
                  in using your <b>@stuy.edu</b> email address.
                </Typography>
                <Typography variant={"body1"}>
                  If the login popup doesn't open, refresh the page and try
                  again or contact stuyboe@gmail.com
                </Typography>

                <div className={layout.flexCenter}>
                  {loading ? <CircularProgress /> : <LoginButton />}
                </div>
              </div>
            ),
          });
        }
      });
    }
  };

  return { signIn, loading };
};

export default useLogin;
