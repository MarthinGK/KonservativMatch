import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { checkIfProfileIsComplete, fetchProfileActiveStatus } from '../api/UserAPI'; // Ensure you have the correct path

const IsProfileComplete = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [status, setStatus] = useState({
    isProfileComplete: false,
    isProfileActive: true,
    loading: true,
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const [isProfileComplete, isProfileActive] = await Promise.all([
            checkIfProfileIsComplete(user),
            fetchProfileActiveStatus(user.sub), // Updated route with retry logic
          ]);
    
          setStatus({
            isProfileComplete,
            isProfileActive,
            loading: false,
          });
    
          // Cache the status in localStorage
          localStorage.setItem('profile_complete', JSON.stringify(isProfileComplete));
          localStorage.setItem('profile_active', JSON.stringify(isProfileActive));
        } catch (error) {
          console.error('Error checking user status:', error);
        }
      } else {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    checkUserStatus();
  }, [isAuthenticated, user]);

  if (isLoading || status.loading) return <div>Loading...</div>;

  if (!status.isProfileActive) {
    return <Navigate to="/deaktivert" />;
  }

  if (!status.isProfileComplete) {
    return <Navigate to="/profile-setup" />;
  }

  return children;
};

export default IsProfileComplete;
