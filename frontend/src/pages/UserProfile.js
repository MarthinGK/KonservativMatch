import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/UserAPI';
import { calculateAge } from '../components/CalculateAge';  // Adjust the path as needed
import '../styles/UserProfile.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const UserProfile = () => {
  const { profileId } = useParams(); // Get profileId from URL
  const [profileData, setProfileData] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchUserProfile(profileId); // Fetch profile data by profileId
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    loadProfileData();
  }, [profileId]);

  if (!profileData) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  // Extract profile photos and remove the first (main) photo from the slider
  const profilePhotos = profileData.photos
    ? profileData.photos.map(photo => `http://localhost:5000${photo}`)
    : [];
  const sliderPhotos = profilePhotos.slice(1); // Skip the first photo for the slider

  // Function to handle sliding to the next photo
  const handleNextPhoto = () => {
    if (currentPhotoIndex < sliderPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  // Function to handle sliding to the previous photo
  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Main profile picture (first photo) */}
        <img
          src={profilePhotos.length > 0 ? profilePhotos[0] : 'default_profile_image.jpg'}
          alt={profileData.first_name}
          className="profile-pic"
        />
        <div className="profile-info">
          <div className="info-item">
            <h2>{profileData.first_name}</h2>
          </div>

          <div className="info-item">
            <i className="fas fa-birthday-cake age-icon"></i>
            <span>{calculateAge(profileData.date_of_birth)} år</span>
          </div>

          <div className="info-item">
            <i className="fas fa-map-marker-alt location-icon"></i>
            <span>{profileData.location}</span>
          </div>

          <div className="info-item">
            <i className="fas fa-ruler-vertical height-icon"></i>
            <span>{profileData.height} cm</span>
          </div>

          <div className="info-item">
            <i className="fas fa-wine-glass-alt alcohol-icon"></i>
            <span>{profileData.alcohol}</span>
          </div>

          <div className="info-item">
            <i className="fas fa-smoking smoking-icon"></i>
            <span>{profileData.smoking}</span>
          </div>

          <div className="info-item">
            <i className="fas fa-pray religion-icon"></i>
            <span>{profileData.religion}</span>
          </div>
        </div>
      </div>

      <div className="introduction-box">
        <h3>Introduksjon</h3>
        <p>{profileData.introduction}</p>
      </div>

      {/* Photo slider */}
      {sliderPhotos.length > 0 && (
        <div className="photo-slider">
          <button onClick={handlePrevPhoto} disabled={currentPhotoIndex === 0}>
            &#10094;
          </button>
          <img
            src={sliderPhotos[currentPhotoIndex]}
            alt="Profile"
            className="slider-photo"
          />
          <button
            onClick={handleNextPhoto}
            disabled={currentPhotoIndex === sliderPhotos.length - 1}
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;