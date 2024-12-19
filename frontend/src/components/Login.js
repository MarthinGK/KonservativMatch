import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/HomePage.css';

const LoginButton = ({ text, className }) => {
  const { loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while checking the authentication status
  }

  return (
    <button
      className={className} // Apply the className prop to the button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            redirect_uri: `${window.location.origin}/home`, // Change this to your redirect URL after login 
          },
        })
      }
    >
      {text}
    </button>
  );
};

export default LoginButton;
