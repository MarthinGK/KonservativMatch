import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while checking the authentication status
  }

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            redirect_uri: 'http://localhost:3000/', // Change this to your redirect URL after login
          },
        })
      }
      className="navbutton"
    >
      Logg inn
    </button>
  );
};

export default LoginButton;