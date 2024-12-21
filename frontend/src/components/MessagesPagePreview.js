import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile, fetchUserId, getPreviewProfile } from '../api/UserAPI'; // Assuming you have this function
import LikeButtonPreview from './LikeButtonPreview';
import '../styles/MessagesPagePreview.css'; // Custom CSS for profile page
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth0 } from '@auth0/auth0-react';

const MessagesPagePreview = ({ selectedProfileId }) => {
    const { user } = useAuth0();
    const userOneId = user.sub;
    const [profileData, setProfileData] = useState(null);
    const [userTwoId, setuserTwoId] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
    const imagesPerPage = 3;



    useEffect(() => {
      const loadProfileData = async () => {
        try {
            console.log("USER ONE: ", userOneId)
            console.log("USER TWO: ", selectedProfileId)
          const data = await getPreviewProfile(selectedProfileId);
          console.log("DATA PHOTOS: ", data.photos)
          if (data.photos) {
            data.photos.sort((a, b) => a.position - b.position);
          } 
  
          const userTwoId = selectedProfileId;

          setProfileData(data);
          setuserTwoId(userTwoId);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      loadProfileData();
    }, [selectedProfileId]);

    useEffect(() => {
        // Scroll the parent container (chat-messages) to the top
        const chatMessagesContainer = document.querySelector('.chat-messages');
        if (chatMessagesContainer) {
          chatMessagesContainer.scrollTop = 0;
        }
      }, [profileData]); // Trigger when profile data is loaded

    if (!profileData) {
      return <div>Loading...</div>;
    }
  
    const { photos } = profileData || [];
    const mainPhoto = photos && photos.length > 0 ? photos[0].photo_url : null;
    const secondPhoto = photos && photos.length > 1 ? photos[1].photo_url : null;
    const paginatedPhotos = photos.slice(startIndex + 2, startIndex + 2 + imagesPerPage);
  
    // const { photos } = profileData || [];
    // const mainPhoto = photos && photos.length > 0 ? photos[0] : null;
    // const secondPhoto = photos && photos.length > 1 ? photos[1] : null;
    // const paginatedPhotos = photos.slice(startIndex + 2, startIndex + 2 + imagesPerPage);
  
    const handleNext = () => {
      if (startIndex + imagesPerPage < photos.length - 2) {
        setStartIndex(startIndex + imagesPerPage);
      }
    };
  
    const handlePrev = () => {
      if (startIndex > 0) {
        setStartIndex(startIndex - imagesPerPage);
      }
    };
  
    const openPhoto = (index) => setSelectedPhotoIndex(index);
    const closePhoto = () => setSelectedPhotoIndex(null);
  
    const showNextPhoto = () => {
      if (selectedPhotoIndex !== null) {
        setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
      }
    };
  
    const showPrevPhoto = () => {
      if (selectedPhotoIndex !== null) {
        setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
      }
    };
  
    return (
      <div className="preview-profilepage-page">
        <div className="preview-profilepage-container">
        
          {mainPhoto && (
            <img
            src={`${mainPhoto}`}
              alt="Profile"
              className="preview-profilepage-pic"
              onClick={() => openPhoto(0)}
            />
          )}
          <div className="preview-profilepage-info">
            <div className="preview-profilepage-info-item">
              <h2>{profileData.first_name}</h2>
            </div>
            <div className="preview-profilepage-info-item">
              <i className="fas fa-birthday-cake age-icon"></i>
              <span>{calculateAge(profileData.date_of_birth)} år</span>
            </div>
            <div className="preview-profilepage-info-item">
              <i className="fas fa-map-marker-alt location-icon"></i>
              <span>{profileData.location}</span>
            </div>
            <div className="preview-profilepage-info-item">
              <i className="fas fa-ruler-vertical height-icon"></i>
              <span>{profileData.height} cm</span>
            </div>
            <div className="preview-profilepage-info-item">
              <i className="fas fa-place-of-worship religion-icon"></i>
              <span>{profileData.religion}</span>
            </div>
            <div className="preview-profilepage-info-item">
              <i className="fas fa-wine-glass-alt alcohol-icon"></i>
              <span>{profileData.alcohol}</span>
            </div>
            <div className="preview-profilepage-info-item">
              <i className="fas fa-smoking smoking-icon"></i>
              <span>{profileData.smoking}</span>
            </div>
          </div>
          <LikeButtonPreview likerId={userOneId} likedId={userTwoId} />
        </div>
  
        
  
        <div className="preview-profilepage-introduction-container">
          <div className="preview-profilepage-introduction-box">
            <h3>Introduksjon</h3>
            <p>{profileData.introduction}</p>
          </div>
          {secondPhoto && (
            <img
            src={`${secondPhoto}`}
              alt="Secondary Profile"
              className="preview-profilepage-secondary-pic"
              onClick={() => openPhoto(1)}
            />
          )}
        </div>
  
        {paginatedPhotos.length > 0 && (
          <div className="preview-profilepage-photo-gallery">
            <button onClick={handlePrev} className="nav-button" disabled={startIndex === 0}>
              &#10094;
            </button>
            <div className="preview-profilepage-photos-wrapper">
              {paginatedPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={`${photo.photo_url}`}
                  alt={`Additional ${startIndex + index + 3}`}
                  className="preview-profilepage-additional-pic"
                  onClick={() => openPhoto(startIndex + index + 2)}
                />
              ))}
            </div>
            <button onClick={handleNext} className="nav-button" disabled={startIndex + imagesPerPage >= photos.length - 2}>
              &#10095;
            </button>
          </div>
        )}
  
        {/* Lightbox for selected photo */}
        {selectedPhotoIndex !== null && (
          <div
            className={`preview-lightbox-overlay ${selectedPhotoIndex !== null ? 'open' : ''}`}
            onClick={closePhoto}
          >
            <button
              className="preview-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                showPrevPhoto();
              }}
            >
              &#10094;
            </button>
            <img
              src={`${photos[selectedPhotoIndex].photo_url}`}
              alt="Selected"
              className="preview-lightbox-photo"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="preview-lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                showNextPhoto();
              }}
            >
              &#10095;
            </button>
            <button className="preview-lightbox-close" onClick={closePhoto}>✕</button>
          </div>
        )}
      </div>
    );
};

// Helper function to calculate age from date of birth
const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default MessagesPagePreview;
