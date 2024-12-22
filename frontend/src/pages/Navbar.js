import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { checkIfProfileIsComplete } from '../api/UserAPI';
import { fetchProfilePhotos } from '../api/PhotosAPI';
import { getUnreadMessagesCount } from '../api/MessagesAPI';
import { getUnseenLikesCount } from '../api/ULikesAPI';
import LogoutButton from '../components/Logout';
import LoginButton from '../components/Login';
import Default from '../images/Default.png';
import Logo from '../components/images/LogoTransparent.png';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth0();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || 'light');
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unseenLikes, setUnseenLikes] = useState(0);
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

          const countUnreadMessages = await getUnreadMessagesCount(user.sub);
          setUnreadMessages(countUnreadMessages);

          const countUnseenLikes = await getUnseenLikesCount(user.sub);
          setUnseenLikes(countUnseenLikes);

          console.log("NAVBAR unseen likes count: ", countUnseenLikes)

          // Find the photo with position 0 and set it as the profile photo
          const primaryPhoto = photos.find((photo) => photo.position === 0);

          if (primaryPhoto) {
            setProfilePhoto(`${primaryPhoto.photo_url}`);
            // FOR LOCAL DEVELOPMENT: setProfilePhoto(`${process.env.REACT_APP_API_BASE_URL}${primaryPhoto.photo_url}`);
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
  }, [isAuthenticated, user, defaultPhoto]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLikesClick = () => {
    setUnseenLikes(0); // Reset unseen likes count when the likes page is accessed
  };

  return (
    <nav className="navbar">
      
      <div className="navbar-logo">
        <Link to="/" className="logo-container">
          <img
            src={Logo}
            alt="KonservativMatch Logo"
            className="nav-logo-image"
          />
          <span 
            className="nav-logo-text">KonservativMatch
            <span className="beta-label">Beta</span>
          </span>
        </Link>
      </div>

      {isAuthenticated && isProfileComplete && (
        <div className="navbar-center">
          <Link to="/likes" className="nav-link" onClick={handleLikesClick}>
            Likes
            {unseenLikes > 0 && <span className="red-dot-navbar"></span>}
          </Link>
          <Link to="/messages" className="nav-link">
            Meldinger
            {unreadMessages > 0 && <span className="red-dot-navbar"></span>}
          </Link>
          <Link to="/search" className="nav-link">Søk</Link>
        </div>
      )}

      <ul className="navbar-menu">
      {isAuthenticated ? (
        <>
        <button onClick={toggleTheme}>Tema</button>

        
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
          </>
        ) : (
          <li>
            <div>
            <LoginButton text={"Logg inn"}/>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;