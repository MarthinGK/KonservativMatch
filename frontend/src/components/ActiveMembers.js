import React, { useEffect, useState } from 'react';
import { fetchActiveMembers } from '../api/UserAPI'; // Import the function to fetch active members
import { useAuth0 } from "@auth0/auth0-react"; // Auth0 authentication hook
import '../styles/NewMembers.css'; // Custom CSS for the layout

const ActiveMembers = () => {
  const [activeMembers, setActiveMembers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const { user, isAuthenticated } = useAuth0(); // Destructure necessary Auth0 context
  const profilesPerPage = 3; // Number of profiles to show per page

  useEffect(() => {
    // Fetch active members when the component loads and user is authenticated
    if (isAuthenticated && user) {
      const loadActiveMembers = async () => {
        try {
          const fetchedMembers = await fetchActiveMembers(user.sub); // Pass user.sub (Auth0 user ID) to the API
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
    <div className="new-members-container">
      <h2>Aktive Brukere</h2> {/* Active Users heading */}
      <div className="profiles-wrapper">
        <button onClick={handlePrev} className="nav-button" disabled={startIndex === 0}>
          &#10094; {/* Left Arrow */}
        </button>
        <div className="profiles">
          {activeMembers.slice(startIndex, startIndex + profilesPerPage).map((member, index) => (
            <div className="profile" key={index}>
              <img
                src={`http://localhost:5000${member.photo_url}`}
                alt={`${member.first_name}`}
                className="profile-picture"
              />
              <div className="profile-background">
                <p className="profile-name">{member.first_name}, {calculateAge(member.date_of_birth)}</p>
                <p className="profile-location">{member.location}</p>
              </div>
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

export default ActiveMembers;
