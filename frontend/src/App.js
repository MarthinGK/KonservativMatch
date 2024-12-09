import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProfileSetup from './components/ProfileSetup';
import Search from './pages/Search';
import IsAuthenticated from './components/IsAuthenticated';
import IsProfileComplete from './components/IsProfileComplete';
import EmailVerification from './pages/EmailVerification';
import { checkUserInDB, updateUserActivity } from './api/UserAPI';
// import { getUnreadMessagesCount } from './api/MessagesAPI';
import ProfilePage from './pages/Profile';

import ProfileEditPage from './pages/EditProfilePage';
import EditAccountPage from './pages/EditAccountPage';
import LikesPage from './pages/LikesPage';
import MessagesPage from './pages/MessagesPage';

import './styles/App.css'; // Global CSS styles

function App() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  // const [unreadMessages, setUnreadMessages] = useState(0);
  useEffect(() => {
    const checkUser = async () => {
      if (isAuthenticated && user) {

        try {
          await getAccessTokenSilently();
          // Await the result of the backend call to check or create user
          await checkUserInDB(user);
          await updateUserActivity(user.sub);  
          console.log('User check completed. given_name: ', user.given_name);
          console.log('User check completed. used_id: ', user.sub);
        } catch (error) {
          console.error('Error checking/creating user:', error);
        }
      }
    };

    checkUser();  // Call the async function
  }, [isAuthenticated, user]);  // Dependencies array to trigger effect

  // const fetchUnreadCount = async () => {
  //   // Fetch unread messages count from API and update state
  //   try {
  //       const count = await getUnreadMessagesCount(); // Replace with your actual API call
  //       setUnreadMessages(count);
  //       console.log("HOME unread messages: ", count)
  //   } catch (error) {
  //       console.error('Error fetching unread messages count:', error);
  //   }
  // };

  return (
    <div className="App">
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={isAuthenticated ? <IsProfileComplete><Explore /></IsProfileComplete> : <Home />} />
          <Route path="/profile-setup" element={<IsAuthenticated><ProfileSetup /></IsAuthenticated>} />
          <Route path="/messages" element={<IsAuthenticated><IsProfileComplete><MessagesPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/likes" element={<IsAuthenticated><IsProfileComplete><LikesPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/search" element={<IsAuthenticated><IsProfileComplete><Search /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/bruker/:brukerId" element={<IsAuthenticated><IsProfileComplete><ProfilePage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/EmailVerification" element={<EmailVerification />} />

          <Route path="/profil" element={<IsAuthenticated><IsProfileComplete><ProfileEditPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/personlig-info" element={<IsAuthenticated><IsProfileComplete><EditAccountPage /></IsProfileComplete></IsAuthenticated>} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App; 