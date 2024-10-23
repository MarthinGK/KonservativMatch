import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const IsAuthenticated = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while checking authentication
  }

  if (!isAuthenticated) {
    localStorage.clear(); // Clear storage when not authorized
    return <Navigate to="/" />; // Redirect to home if not authenticated
  }

  return children; // Render the component if authenticated qwd
};

export default IsAuthenticated;