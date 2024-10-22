import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/NavBar.css';
import LogoutButton from './LogoutButton';
import { checkIfProfileIsComplete, checkUserInDB } from '../api/UserAPI';

const NavBar = () => {
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
    if (isAuthenticated && user && user.email_verified === false) {
      return <Navigate to="/EmailVerification" />;
    }
    if (isAuthenticated && user) {
      const fetchProfileStatus = async () => {
        const profileComplete = await checkIfProfileIsComplete(user);
        setIsProfileComplete(profileComplete);
      };
      fetchProfileStatus();
    }
  }, [isAuthenticated, user]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ color: theme.color }}>KonservativMatch</Link>
      </div>

      {isAuthenticated && isProfileComplete && (
        <div className="navbar-center">
          <Link to="/search" className="nav-link">Søk</Link>
          <Link to="/likes" className="nav-link">Likes</Link>
          <Link to="/messages" className="nav-link">Meldinger</Link>
        </div>
      )}

      <ul className="navbar-menu">
        {isAuthenticated ? (
          <li>
            <LogoutButton />
          </li>
        ) : (
          <li>
            <button
              onClick={() => loginWithRedirect({
                authorizationParams: {
                  redirect_uri: 'http://localhost:3000/'
                }
              })}
              className='navbutton'
              style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
            >
              Logg inn
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

export default NavBar;