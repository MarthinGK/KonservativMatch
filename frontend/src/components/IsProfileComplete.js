import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { checkIfProfileIsComplete, checkUserInDB } from '../api/UserAPI'; // Ensure you have the correct path


const IsProfileComplete = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isProfileComplete, setIsProfileComplete] = useState(
    JSON.parse(localStorage.getItem('profile_complete')) || false
  );

  useEffect(() => {
    const checkUser = async () => {
      if (isAuthenticated && user) {
        try {
          // Await the result of the backend call
          const isProfileComplete = await checkIfProfileIsComplete(user);
          if(isProfileComplete) {
            setIsProfileComplete(true);
            localStorage.setItem('profile_complete', true);  // Store status in localStorage
          }
          console.log('User check completed');
        } catch (error) {
          console.error('Error checking/creating user:', error);
        }
      }
    };
  
    checkUser();  // Call the async function
  }, [isAuthenticated, user]);  // Dependencies array to trigger effect

  if (isLoading) return <div>Loading...</div>;

  return (
    isProfileComplete ? (
        children
    ) : (
        <Navigate to="/profile-setup" />
    )
  );
};

export default IsProfileComplete;
  