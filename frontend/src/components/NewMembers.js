import React, { useEffect, useState } from 'react';
import { fetchNewMembers } from '../api/UserAPI'; // Import the function to fetch new members
import '../styles/NewMembers.css'; // Custom CSS for the layout

const NewMembers = () => {
  const [newMembers, setNewMembers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const profilesPerPage = 3;

  useEffect(() => {
    // Fetch new members when the component loads
    const loadNewMembers = async () => {
      try {
        const fetchedMembers = await fetchNewMembers(); // Call the API to fetch new members
        setNewMembers(fetchedMembers); // Store the new members in state
        console.log("Fetched members: ", fetchedMembers);
      } catch (error) {
        console.error('Error fetching new member photos:', error);
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
    <div className="new-members-container">
      <h2>New Members</h2>
      <div className="profiles-wrapper">
        <button onClick={handlePrev} className="nav-button" disabled={startIndex === 0}>
          &#10094; {/* Left Arrow */}
        </button>
        <div className="profiles">
          {newMembers.slice(startIndex, startIndex + profilesPerPage).map((member, index) => (
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