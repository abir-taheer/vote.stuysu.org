import GoogleLogin from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../../constants";
import { gql, useMutation } from "@apollo/client";
import { useContext } from "react";
import UserContext from "./UserContext";
import alertDialog from "../dialog/alertDialog";

const MUTATION = gql`
  mutation($idToken: String!) {
    login(idToken: $idToken)
  }
`;

const GoogleLoginButton = () => {
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

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      buttonText="Login With Google"
      onSuccess={onSuccess}
      onFailure={console.log}
      cookiePolicy={"single_host_origin"}
      disabled={loading}
    />
  );
};

export default GoogleLoginButton;
