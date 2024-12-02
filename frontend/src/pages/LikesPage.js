import React, { useEffect, useState } from 'react';
import { fetchLikes, fetchLikedMe } from '../../api/LikesAPI'; // API methods
import '../styles/LikesPage.css'; // Add styles for this page
import { useAuth0 } from '@auth0/auth0-react';

const LikesPage = () => {
    const { user } = useAuth0();
    const userId = user.sub;
  const [likes, setLikes] = useState([]);
  const [likedMe, setLikedMe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        const likedProfiles = await fetchLikes(userId);
        const likedMeProfiles = await fetchLikedMe(userId);
        setLikes(likedProfiles);
        setLikedMe(likedMeProfiles);
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikesData();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="likes-page">
      <h2>Likes</h2>

      <div className="section">
        <h3>Profiles You Liked</h3>
        <div className="profiles-container">
          {likes.length > 0 ? (
            likes.map((profile) => (
              <div className="profile-card" key={profile.user_id}>
                <img
                  src={profile.photo_url}
                  alt={`${profile.first_name}'s profile`}
                  className="profile-picture"
                />
                <div className="profile-details">
                  <p className="profile-name">{profile.first_name}, {profile.age}</p>
                  <p className="profile-location">{profile.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No profiles liked yet.</p>
          )}
        </div>
      </div>

      <div className="section">
        <h3>Profiles Who Liked You</h3>
        <div className="profiles-container">
          {likedMe.length > 0 ? (
            likedMe.map((profile) => (
              <div className="profile-card" key={profile.user_id}>
                <img
                  src={profile.photo_url}
                  alt={`${profile.first_name}'s profile`}
                  className="profile-picture"
                />
                <div className="profile-details">
                  <p className="profile-name">{profile.first_name}, {profile.age}</p>
                  <p className="profile-location">{profile.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No one has liked you yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesPage;