import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/UserAPI';

const Login = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile('auth0|66e4aef1240d3d47021a4133');
        setUser(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  return (
    <div>
      {user ? <h1>Welcome, {user.name}</h1> : <p>Loading user data...</p>}
    </div>
  );
};

export default Login;