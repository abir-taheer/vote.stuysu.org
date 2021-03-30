import { gql, useMutation } from "@apollo/client";
import { useContext } from "react";
import UserContext from "./UserContext";
import alertDialog from "../dialog/alertDialog";

import { useGoogleLogin } from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../../constants";
import confirmDialog from "../dialog/confirmDialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import Link from "@material-ui/core/Link";

const MUTATION = gql`
  mutation($idToken: String!) {
    login(idToken: $idToken)
  }
`;

const useLogin = () => {
  const [login, { loading }] = useMutation(MUTATION);
  const user = useContext(UserContext);

  const onSuccess = async ({ tokenId, profileObj }) => {
    try {
      const response = await login({ variables: { idToken: tokenId } });
      const jwt = response.data.login;
      localStorage.setItem("auth-jwt", jwt);

      await user.refetch();
    } catch (e) {
      const error = e.graphQLErrors[0];
      const code = error.extensions.code;

      if (code === "FORBIDDEN") {
        await alertDialog({
          title: "There was an error authenticating you",
          body: e.message,
        });
      }

      if (code === "UNKNOWN_USER") {
        await alertDialog({
          title: "There was an error authenticating you",
          body: `There's no user with the email address ${profileObj.email} in the database. \nIf you feel this is an error, please email stuyboe@gmail.com`,
        });
      }
    }
  };

  const { signIn: googleSignIn } = useGoogleLogin({
    onSuccess,
    clientId: GOOGLE_CLIENT_ID,
    cookiePolicy: "single_host_origin",
    onFailure: console.log,
    uxMode: "popup",
  });

  const signIn = async () => {
    const confirmed = await confirmDialog({
      title: "Before you log in",
      body: (
        <DialogContentText>
          <p>
            This app uses{" "}
            <Link
              href={"https://developers.google.com/identity/protocols/oauth2"}
              target={"_blank"}
              color={"secondary"}
            >
              Google OAuth
            </Link>{" "}
            to sign you in and only requests the basic profile scope.
          </p>
          <p>
            Click the "Sign In With Google" button on the bottom right and sign
            in using your <b>@stuy.edu</b> email address.
          </p>
          <p>
            If the login popup doesn't open, refresh the page and try again or
            contact stuyboe@gmail.com
          </p>
        </DialogContentText>
      ),
      acceptanceText: "Sign In With Google",
    });

    if (confirmed) {
      googleSignIn();
    }
  };

  return { signIn, loading };
};

export default useLogin;
