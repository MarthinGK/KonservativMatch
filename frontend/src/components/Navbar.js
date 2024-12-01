import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { checkIfProfileIsComplete } from '../api/UserAPI';
import { fetchProfilePhotos } from '../api/PhotosAPI';
import LogoutButton from './Logout';
import Default from '../images/Default.png';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || 'light');
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const dropdownRef = useRef(null);
  const defaultPhoto = Default;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchProfileStatus = async () => {
        try {
          const profileComplete = await checkIfProfileIsComplete(user);
          setIsProfileComplete(profileComplete);

          const photos = await fetchProfilePhotos(user.sub);

          // Find the photo with position 0 and set it as the profile photo
          const primaryPhoto = photos.find((photo) => photo.position === 0);

          if (primaryPhoto) {
            setProfilePhoto(`http://localhost:5000${primaryPhoto.photo_url}`);
          } else {
            setProfilePhoto(defaultPhoto); // Set default photo if none found
          }
        } catch (error) {
          console.error('Error fetching profile photos:', error);
          setProfilePhoto(defaultPhoto);
        }
      };
      fetchProfileStatus();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ color: theme.color }}>KonservativMatch</Link>
      </div>

      {isAuthenticated && isProfileComplete && (
        <div className="navbar-center">
          <Link to="/likes" className="nav-link">Likes</Link>
          <Link to="/matches" className="nav-link">Matcher</Link>
          <Link to="/messages" className="nav-link">Meldinger</Link>
          <Link to="/search" className="nav-link">Søk</Link>
        </div>
      )}

      <ul className="navbar-menu">
        <button onClick={toggleTheme}>Tema</button>

        {isAuthenticated ? (
          <li className="nav-dropdown" onClick={toggleDropdown} ref={dropdownRef}>
            <img
              src={profilePhoto}
              alt="Profile"
              className="nav-profile-photo"
            />
            <span className="nav-dropdown-arrow">▼</span>
            {showDropdown && (
              <ul className="nav-dropdown-menu">
                <li><Link to="/profil">Profil</Link></li>
                <li><Link to="/personlig-info">Brukerinfo</Link></li>
                <li><Link to="/abonnement">Abonnement</Link></li>
                <li><Link to="/sikkerhet">Sikkerhet</Link></li>
                <li><Link to="/hjelp">Hjelp</Link></li>
                <li>
                  <LogoutButton className="nav-logout-button" />
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>
            <button onClick={() => loginWithRedirect()} className="navbutton">
              Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;



