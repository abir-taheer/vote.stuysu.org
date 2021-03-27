import GoogleLogin from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../../constants";
import { gql, useMutation } from "@apollo/client";
import { useContext } from "react";
import UserContext from "./UserContext";

const MUTATION = gql`
  mutation($idToken: String!) {
    login(idToken: $idToken)
  }
`;

const GoogleLoginButton = () => {
  const [login, { loading }] = useMutation(MUTATION);
  const user = useContext(UserContext);

  const onSuccess = async ({ tokenId }) => {
    try {
      const response = await login({ variables: { idToken: tokenId } });
      const jwt = response.data.login;
      localStorage.setItem("auth-jwt", jwt);

      await user.refetch();
    } catch (e) {}
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
