import React, { useEffect, useState } from 'react';
import { fetchExploreMembers } from '../api/UserAPI'; // Import the function that fetches explore members
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/Explore.css'; // Import the explore-specific CSS for layout and styling

const Explore = () => {
  const [exploreMembers, setExploreMembers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const profilesPerPage = 3;

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch explore members when the component loads
      const loadExploreMembers = async () => {
        try {
          // Call the function to get members to explore (those who haven't interacted yet)
          const fetchedMembers = await fetchExploreMembers(user.sub);
          setExploreMembers(fetchedMembers); // Set the fetched members in the state
        } catch (error) {
          console.error('Error fetching explore members:', error);
        }
      };
      loadExploreMembers();
    }
  }, [isAuthenticated, user]);

  const handleNext = () => {
    if (startIndex + profilesPerPage < exploreMembers.length) {
      setStartIndex(startIndex + profilesPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - profilesPerPage);
    }
  };

  return (
    <div className="explore-container">
      <h2>Explore Members</h2>
      <div className="profiles-wrapper">
        <button onClick={handlePrev} className="nav-button" disabled={startIndex === 0}>
          &#10094; {/* Left Arrow */}
        </button>
        <div className="profiles">
          {exploreMembers.slice(startIndex, startIndex + profilesPerPage).map((member, index) => (
            <div className="profile-card" key={index}>
              <img src={`http://localhost:5000${member.photo_url}`} alt={member.first_name} className="profile-pic" />
              <div className="profile-info">
                <p className="profile-name">{member.first_name}, {calculateAge(member.date_of_birth)}</p>
                <p className="profile-location">{member.location}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleNext} className="nav-button" disabled={startIndex + profilesPerPage >= exploreMembers.length}>
          &#10095; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

// Function to calculate age from the date of birth
const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default Explore;
