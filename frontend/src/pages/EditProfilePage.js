import React, { useState } from 'react';
import EditProfilePreviewProfile from '../components/editprofile/EditProfilePreviewProfile';
import EditProfilePhotosGrid from '../components/editprofile/EditProfilePhotosGrid';
import EditProfileIntro from '../components/editprofile/EditProfileIntro';
import EditProfileAboutYou from '../components/editprofile/EditProfileAboutYou';
import '../styles/EditProfilePage.css'; // Add custom styles if needed
import { useAuth0 } from '@auth0/auth0-react';

const ProfileEditPage = () => {
  const [isEditing, setIsEditing] = useState(true); // Default to "Edit Profile" mode
  const { user } = useAuth0();
  const userId = user.sub;

  const toggleMode = (mode) => {
    setIsEditing(mode);
  };

  return (
    <div className="profile-edit-page">
      <div className="secondary-navbar">
        <button
          className={`secondary-button ${isEditing ? 'active' : ''}`}
          onClick={() => toggleMode(true)}
        >
          Rediger profil
        </button>
        <button
          className={`secondary-button ${!isEditing ? 'active' : ''}`}
          onClick={() => toggleMode(false)}
        >
          Forhåndsvis profil
        </button>
      </div>


      <div className="profile-content">
        {isEditing ? (
          <div className="edit-profile-container">
            <EditProfilePhotosGrid userId={userId} />
            <EditProfileIntro userId={userId} />
            <EditProfileAboutYou userId={userId} />
          </div>
        ) : (
          <EditProfilePreviewProfile userId={userId} />
        )}
      </div>
    </div>
  );
};

export default ProfileEditPage;
