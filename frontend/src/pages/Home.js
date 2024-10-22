import React, { useEffect, useState } from 'react';
import { fetchNewMembers } from '../api/UserAPI';  // Fetch new members from your API
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/Home.css';  // Custom CSS for the home page layout

const Home = () => {
  const { isAuthenticated, user } = useAuth0();  // Use Auth0 to manage authentication
  const [newMembers, setNewMembers] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch new members when the component loads
      const loadNewMembers = async () => {
        try {
          const fetchedMembers = await fetchNewMembers(user.sub);  // Fetch new members for the current user
          setNewMembers(fetchedMembers);  // Set the fetched members into state
        } catch (error) {
          console.error('Error fetching new members:', error);
        }
      };
      loadNewMembers();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="home-container">
      <h2>Welcome to KonservativMatch</h2>
      {isAuthenticated ? (
        <div className="new-members-section">
          <h3>New Members</h3>
          <div className="new-members-list">
            {newMembers.length > 0 ? (
              newMembers.map((member, index) => (
                <div className="member-card" key={index}>
                  <img src={`http://localhost:5000${member.photo_url}`} alt={`${member.first_name}`} className="member-pic" />
                  <p className="member-name">{member.first_name}, {calculateAge(member.date_of_birth)}</p>
                  <p className="member-location">{member.location}</p>
                </div>
              ))
            ) : (
              <p>No new members available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="logged-out-message">
          <p>Please log in to see new members.</p>
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

export default Home;