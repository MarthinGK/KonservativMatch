import React, { useEffect, useState } from 'react';
import { fetchNewMembers } from '../api/UserAPI'; // Import the function to fetch new members
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/ExploreProfiles.css'; // Custom CSS for the layout
import { Link } from 'react-router-dom';
const NewMembers = () => {
  const [newMembers, setNewMembers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const profilesPerPage = 3;
  const { user, isAuthenticated } = useAuth0();
  useEffect(() => {
    // Fetch new members when the component loads
    const loadNewMembers = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await fetchNewMembers(user.sub); // Pass user_id (sub) from Auth0
          setNewMembers(response);
        } catch (error) {
          console.error('Error fetching new members:', error);
        }
      }
    };

    loadNewMembers();
  }, []);

  const handleNext = () => {
    if (startIndex + profilesPerPage < newMembers.length) {
      setStartIndex(startIndex + profilesPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - profilesPerPage);
    }
  };



  return (
    <div className="exploreprofiles-topcontainer">
      <h3>Nye medlemmer</h3>
      <div className="exploreprofiles-wrapper">
        <button onClick={handlePrev} className="nav-button" disabled={startIndex === 0}>
          &#10094; {/* Left Arrow */}
        </button>
        <div className="exploreprofiles">
          {newMembers.slice(startIndex, startIndex + profilesPerPage).map((member, index) => (
            <div className="exploreprofile" key={index}>
            <Link to={`/bruker/${member.profile_id}`}>
              <img src={`http://localhost:5000${member.photo_url}`} alt={`${member.first_name}`} className="profile-picture" />
              <div className="exploreprofile-background">
                <p className="exploreprofile-name">{member.first_name}, {calculateAge(member.date_of_birth)}</p>
                <p className="exploreprofile-location">{member.location}</p>
              </div>
            </Link>
            </div>
          ))}
        </div>
        <button onClick={handleNext} className="nav-button" disabled={startIndex + profilesPerPage >= newMembers.length}>
          &#10095; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

// Helper function to calculate age from date of birth 
const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default NewMembers;