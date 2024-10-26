import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../api/UserAPI'; // Assuming you have this function
import '../styles/ProfilePage.css'; // Custom CSS for profile page

const ProfilePage = () => {
  const { profileId } = useParams(); // Get profileId from URL
  const [profileData, setProfileData] = useState(null);

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

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img src={`http://localhost:5000${profileData.photo_url}`} alt={profileData.first_name} className="profile-pic" />
        <div className="profile-info">
          <h1>{profileData.first_name}, {calculateAge(profileData.date_of_birth)}</h1>
          <p className="location">{profileData.location}</p>
        </div>
      </div>
      <div className="introduction-box">
        <h2>Introduction</h2>
        <p>{profileData.introduction}</p>
      </div>
    </div>
  );
};

// Function to calculate age from date of birth
const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default ProfilePage;
