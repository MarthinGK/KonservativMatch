import React, { useEffect, useState } from 'react';
import { fetchLikeStatus, toggleLike } from '../api/likesAPI'; // Import API calls
import '../styles/LikeButton.css';

const LikeButton = ({ likerId, likedId }) => {
  const [liked, setLiked] = useState(false); // Track like status

  // Fetch initial like status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const isLiked = await fetchLikeStatus(likerId, likedId); // Call API
        setLiked(isLiked); // Update state
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchStatus();
  }, [likerId, likedId]);

  // Handle like toggle
  const handleLikeToggle = async () => {
    try {
      const isLiked = await toggleLike(likerId, likedId); // Call API
      setLiked(isLiked); // Update state
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  return (
    <div className="like-button-container">
      <button
        className={`like-button ${liked ? 'liked' : ''}`}
        onClick={handleLikeToggle}
      >
        <i className="fas fa-heart"></i>
      </button>
      <p className="like-status-text">{liked ? 'Likt' : 'Lik'}</p>
    </div>
  );
};

export default LikeButton;

