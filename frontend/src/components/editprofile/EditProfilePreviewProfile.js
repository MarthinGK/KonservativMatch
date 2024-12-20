import React, { useEffect, useState } from 'react';
import { getPreviewProfile } from '../../api/UserAPI'; // Assuming you have this function
import '../../styles/ProfilePage.css'; // Custom CSS for profile page
import '../../styles/editprofile/EditProfileHeader.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EditProfilePreviewProfile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const imagesPerPage = 3;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await getPreviewProfile(userId);
  
        // Sort the photos by position
        if (data.photos) {
          data.photos.sort((a, b) => a.position - b.position);
        } 
  
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    loadProfileData();
  }, [userId]);  

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const { photos } = profileData || [];
  const mainPhoto = photos && photos.length > 0 ? photos[0].photo_url : null;
  const secondPhoto = photos && photos.length > 1 ? photos[1].photo_url : null;
  const paginatedPhotos = photos.slice(startIndex + 2, startIndex + 2 + imagesPerPage);

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
    <div className="profilepage-page">
      <div className="profilepage-container">
        {mainPhoto && (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${mainPhoto}`}
            alt="Profile"
            className="profilepage-pic"
            onClick={() => openPhoto(0)}
          />
        )}
        <div className="profilepage-info">
          <div className="profilepage-info-item">
            <h2>{profileData.first_name}</h2>
          </div>
          <div className="profilepage-info-item">
            <i className="fas fa-birthday-cake age-icon"></i>
            <span>{calculateAge(profileData.date_of_birth)} år</span>
          </div>
          <div className="profilepage-info-item">
            <i className="fas fa-map-marker-alt location-icon"></i>
            <span>{profileData.location}</span>
          </div>
          <div className="profilepage-info-item">
            <i className="fas fa-ruler-vertical height-icon"></i>
            <span>{profileData.height} cm</span>
          </div>
          <div className="profilepage-info-item">
            <i className="fas fa-wine-glass-alt alcohol-icon"></i>
            <span>{profileData.alcohol}</span>
          </div>
          <div className="profilepage-info-item">
            <i className="fas fa-smoking smoking-icon"></i>
            <span>{profileData.smoking}</span>
          </div>
          <div className="profilepage-info-item">
            <i className="fas fa-place-of-worship religion-icon"></i>
            <span>{profileData.religion}</span>
          </div>
          <div className="profilepage-info-item">
            <i className="fas fa-landmark political-icon"></i>
            <span>{profileData.political_party}</span>
          </div>
          <div className="profilepage-info-item">
            <i className="fa-solid fa-child-reaching child-icon"></i>
            <span>{profileData.want_children}</span>
          </div>
        </div>
      </div>

      <div className="profilepage-introduction-container">
        <div className="profilepage-introduction-box">
          <h3>Introduksjon</h3>
          <p>{profileData.introduction}</p>
        </div>
        {secondPhoto && (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${secondPhoto}`}
            alt="Secondary Profile"
            className="profilepage-secondary-pic"
            onClick={() => openPhoto(1)}
          />
        )}
      </div>

      {paginatedPhotos.length > 0 && (
        <div className="profilepage-photo-gallery">
          <button onClick={handlePrev} className="nav-button" disabled={startIndex === 0}>
            &#10094;
          </button>
          <div className="profilepage-photos-wrapper">
            {paginatedPhotos.map((photo, index) => (
              <img
                key={index}
                src={`${process.env.REACT_APP_API_BASE_URL}${photo.photo_url}`}
                alt={`Additional ${startIndex + index + 3}`}
                className="profilepage-additional-pic"
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
          className={`lightbox-overlay ${selectedPhotoIndex !== null ? 'open' : ''}`}
          onClick={closePhoto}
        >
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); showPrevPhoto(); }}>
            &#10094;
          </button>
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${photos[selectedPhotoIndex].photo_url}`}
            alt="Selected"
            className="lightbox-photo"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); showNextPhoto(); }}>
            &#10095;
          </button>
          <button className="lightbox-close" onClick={closePhoto}>✕</button>
        </div>
      )}
    </div>
  );
};

// Function to calculate age from date of birth
const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default EditProfilePreviewProfile;

