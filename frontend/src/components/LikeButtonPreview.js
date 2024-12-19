import React, { useEffect, useState } from 'react';
import { checkPermission } from '../api/PermissionsAPI';
import { fetchLikeStatus, toggleLike } from '../api/ULikesAPI'; // Import API calls
import { useNavigate } from 'react-router-dom';
import '../styles/LikeButton.css';

const LikeButtonPreview = ({ likerId, likedId }) => {
  const [liked, setLiked] = useState(false); // Track like status
  const [canChat, setCanChat] = useState(false);
  const navigate = useNavigate();
  // Fetch initial like status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const isLiked = await fetchLikeStatus(likerId, likedId); // Call API
        setLiked(isLiked); // Update state

        const hasPermission = await checkPermission(likerId, likedId);
        setCanChat(hasPermission);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchStatus();
  }, [likerId, likedId]);
  const handleChatRedirect = () => {
    navigate('/messages', { state: { selectedUserId: likedId } }); // Pass selected user ID
  };
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
      <div className="button-with-text">
        <button
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleLikeToggle}
        >
          <i className="fas fa-heart"></i>
        </button>
        <p className="like-status-text">{liked ? 'Likt' : ''}</p>
      </div>
    </div>
  );
  
};

export default LikeButtonPreview;

