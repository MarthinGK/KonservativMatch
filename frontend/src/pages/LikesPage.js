import React, { useState, useEffect } from 'react';
import { fetchLikes, fetchLikedMe } from '../api/TempLikesAPI.js';
import '../styles/LikesPage.css'; // Add custom styles for this page
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const LikesPage = () => {
  const { user } = useAuth0();
  const userId = user.sub;
  const [isLikedProfiles, setIsLikedProfiles] = useState(true); // Default to "Profiles You Liked"
  const [likes, setLikes] = useState([]);
  const [likedMe, setLikedMe] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);

  const [page, setPage] = useState(1); // For infinite scrolling

  const profilesPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isLikedProfiles) {
          const likedProfiles = await fetchLikes(userId);
          setLikes(likedProfiles);
        } else {
          const likedMeProfiles = await fetchLikedMe(userId);
          setLikedMe(likedMeProfiles);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLikedProfiles, userId]);

  const toggleMode = (mode) => {
    setIsLikedProfiles(mode);
  };

  return (
    <div className="likes-page">
      {/* Sub-navbar */}
      <div className="secondary-navbar-likes">
        <button
          className={`secondary-button-likes ${isLikedProfiles ? 'active' : ''}`}
          onClick={() => toggleMode(true)}
        >
          Profiles You Liked
        </button>
        <button
          className={`secondary-button-likes ${!isLikedProfiles ? 'active' : ''}`}
          onClick={() => toggleMode(false)}
        >
          Profiles Who Liked You
        </button>
      </div>

      {/* Content */}
      <div className="likes-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : isLikedProfiles ? (
          <div className="profiles-container">
            {likes.length > 0 ? (
            <div className="likesprofile-topcontainer">
              <h3>Personer du har likt</h3>
              <div className="likesprofile-wrapper">
                <div className="likesprofiles">
                  {(isLikedProfiles ? likes : likedMe).map((profile, index) => (
                    <div className="likesprofile" key={index}>
                      <Link to={`/bruker/${profile.profile_id}`}>
                        <img
                          src={`http://localhost:5000${profile.photo_url}`}
                          alt={`${profile.first_name}`}
                          className="profile-picture"
                        />
                        <div className="likesprofile-background">
                          <p className="likesprofile-name">
                            {profile.first_name}, {calculateAge(profile.date_of_birth)}
                          </p>
                          <p className="likesprofile-location">{profile.location}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : (
              <p>No profiles liked yet.</p>
            )}
          </div>
        ) : (
          <div className="profiles-container">
            {likes.length > 0 ? (
            <div className="likesprofile-topcontainer">
              <h3>Personer som har likt deg</h3>
              <div className="likesprofile-wrapper">
                <div className="likesprofiles">
                  {(isLikedProfiles ? likes : likedMe).map((profile, index) => (
                    <div className="likesprofile" key={index}>
                      <Link to={`/bruker/${profile.profile_id}`}>
                        <img
                          src={`http://localhost:5000${profile.photo_url}`}
                          alt={`${profile.first_name}`}
                          className="profile-picture"
                        />
                        <div className="likesprofile-background">
                          <p className="likesprofile-name">
                            {profile.first_name}, {calculateAge(profile.date_of_birth)}
                          </p>
                          <p className="likesprofile-location">{profile.location}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : (
              <p>Ingen likes enda</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default LikesPage;
