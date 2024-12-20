import React, { useEffect, useState } from 'react';
import { fetchCloseMembers } from '../api/UserAPI'; // Import the function to fetch active members
import { useAuth0 } from "@auth0/auth0-react"; // Auth0 authentication hook
import '../styles/ExploreProfiles.css'; // Custom CSS for the layout
import { Link } from 'react-router-dom';

const CloseMembers = () => {
  const [activeMembers, setActiveMembers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const { user, isAuthenticated } = useAuth0(); // Destructure necessary Auth0 context
  const profilesPerPage = 3; // Number of profiles to show per page

  useEffect(() => {
    // Fetch active members when the component loads and user is authenticated
    if (isAuthenticated && user) {
      const loadActiveMembers = async () => {
        try {
          const fetchedMembers = await fetchCloseMembers(user.sub); // Pass user.sub (Auth0 user ID) to the API
          setActiveMembers(fetchedMembers); // Store active members in state
          console.log("Fetched active members: ", fetchedMembers);
        } catch (error) {
          console.error('Error fetching active members:', error);
        }
      };
      loadActiveMembers();
    }
  }, [isAuthenticated, user]); // Dependencies on user and authentication status

  const handleNext = () => {
    if (startIndex + profilesPerPage < activeMembers.length) {
      setStartIndex(startIndex + profilesPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - profilesPerPage);
    }
  };

  return (
    <div className="exploreprofiles-container">
      <h3>Nære deg</h3> {/* Active Users heading */}
      <div className="exploreprofiles-wrapper">
        <button onClick={handlePrev} className="nav-button" disabled={startIndex === 0}>
          &#10094; {/* Left Arrow */}
        </button>
        <div className="exploreprofiles">
        {activeMembers.slice(startIndex, startIndex + profilesPerPage).map((member, index) => (
          <div className="exploreprofile" key={index}>
            <Link to={`/bruker/${member.profile_id}`}>
              <img src={`${process.env.REACT_APP_API_BASE_URL}${member.photo_url}`} alt={`${member.first_name}`} className="profile-picture" />
              <div className="exploreprofile-background">
                <p className="exploreprofile-name">{member.first_name}, {calculateAge(member.date_of_birth)}</p>
                <p className="exploreprofile-location">{member.location}</p>
              </div>
            </Link>
          </div>
        ))}
        </div>
        <button onClick={handleNext} className="nav-button" disabled={startIndex + profilesPerPage >= activeMembers.length}>
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

export default CloseMembers;