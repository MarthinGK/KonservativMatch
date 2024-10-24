import React from 'react';
import '../styles/Home.css'; // Assuming you have a separate CSS file for styles

const Home = () => {
  return (
    <div className="home">
      <div className="background-image">
        <div className="content">
          <h1>Welcome to [Your Dating Site]</h1>
          <p>Find your perfect match today!</p>
          
          {/* Email input and join button */}
          <div className="email-signup">
            <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
            />
            <button className="join-btn">Join</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
