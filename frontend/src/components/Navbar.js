import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import LogoutButton from './Logout';
import { checkIfProfileIsComplete } from '../api/UserAPI'; // Add your API call for profile completion

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Only check profile completeness if the user is authenticated 
    if (isAuthenticated && user) {
      const fetchProfileStatus = async () => {
        const profileComplete = await checkIfProfileIsComplete(user);
        setIsProfileComplete(profileComplete);  // Set state based on response
      };
      fetchProfileStatus();
    }
  }, [isAuthenticated, user]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ color: theme.color }}>Konservativdating</Link>
      </div>

      {/* Only show if user is authenticated and profile is complete */}
      {isAuthenticated && isProfileComplete && (
        <div className="navbar-center">
          <Link to="/likes" className="nav-link">Likes</Link>
          <Link to="/messages" className="nav-link">Messages</Link>
          <Link to="/search" className="nav-link">Search</Link>
        </div>
      )}

      <ul className="navbar-menu">
        {isAuthenticated ? (
          <li>
            <LogoutButton />
          </li>
        ) : (
          <li>
            <button onClick={() => loginWithRedirect()} className='navbutton' style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
              Login
            </button>
          </li>
        )}
        <button onClick={toggleTheme}>
          Tema
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;