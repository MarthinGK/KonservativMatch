import React from 'react';
import '../styles/HomePage.css'; // Assuming you have a separate CSS file for styles 
import LoginButton from '../components/Login';

const Home = () => {
  return (
    <div className="home">
      <div className="background-image">
        <div className="content">
          <div>
            <h1 className="home-font">Felles verdier — Felles fremtid</h1>
            <h3 className="home-font">Kjærlighet blomstrer best når prinsipper og politiske holdninger er på samme linje</h3>  
            <h3 className="home-font">KonservativMatch: For deg som setter verdier over trender</h3>
            <div>
              <LoginButton className="home-join-btn" text={"Bli med"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;