import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProfileSetup from './components/ProfileSetup';
import Messages from './pages/Messages';
import Likes from './pages/Likes';
import Search from './pages/Search';
import IsAuthenticated from './components/IsAuthenticated';
import IsProfileComplete from './components/IsProfileComplete';
import EmailVerification from './pages/EmailVerification';
import { checkUserInDB } from './api/UserAPI';
import './styles/App.css'; // Global CSS styles

function App() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const checkUser = async () => {
      if (isAuthenticated && user) {

        try {
          await getAccessTokenSilently();
          // Await the result of the backend call to check or create user
          await checkUserInDB(user);  
          console.log('User check completed. user found: ', user.given_name);
        } catch (error) {
          console.error('Error checking/creating user:', error);
        }
      }
    };

    checkUser();  // Call the async function
  }, [isAuthenticated, user]);  // Dependencies array to trigger effect

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={isAuthenticated ? <IsProfileComplete><Explore /></IsProfileComplete> : <Home />} />
          <Route path="/profile-setup" element={<IsAuthenticated><ProfileSetup /></IsAuthenticated>} />
          <Route path="/messages" element={<IsAuthenticated><IsProfileComplete><Messages /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/likes" element={<IsAuthenticated><IsProfileComplete><Likes /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/search" element={<IsAuthenticated><IsProfileComplete><Search /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/EmailVerification" element={<EmailVerification />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;