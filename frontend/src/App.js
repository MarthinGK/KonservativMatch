import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Navbar from './pages/Navbar';
import Footer from './pages/footer/Footer';

import Home from './pages/HomePage';
import Explore from './pages/Explore';
import ProfileSetup from './pages/ProfileSetup';
import Search from './pages/Search';
import IsAuthenticated from './components/IsAuthenticated';
import IsProfileComplete from './components/IsProfileComplete';
import EmailVerification from './pages/EmailVerification';
import { checkUserInDB, updateUserActivity } from './api/UserAPI';

import ProfilePage from './pages/ProfilePage';

import ProfileEditPage from './pages/EditProfilePage';
import EditAccountPage from './pages/EditAccountPage';
import LikesPage from './pages/LikesPage';
import MessagesPage from './pages/MessagesPage';

import ConditionsPage from './pages/footer/ConditionsPage';
import AboutUsPage from './pages/footer/AboutUsPage';
import PrivacyPolicyPage from './pages/footer/PrivacyPolicyPage';
import ContactPage from './pages/footer/ContactPage';

import './styles/App.css'; // Global CSS styles

function AppLayout() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const location = useLocation();
  const hideFooterOnRoutes = ['/messages', '/profile-setup']; // Add other paths if needed.

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

  return (
      <div className="app">
        <div className="main-content">
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

            <Route path="/vilkår" element={<IsAuthenticated><IsProfileComplete><ConditionsPage /></IsProfileComplete></IsAuthenticated>} />
            <Route path="/om-oss" element={<IsAuthenticated><IsProfileComplete><AboutUsPage /></IsProfileComplete></IsAuthenticated>} />
            <Route path="/personvern" element={<IsAuthenticated><IsProfileComplete><PrivacyPolicyPage /></IsProfileComplete></IsAuthenticated>} />
            <Route path="/kontakt" element={<IsAuthenticated><IsProfileComplete><ContactPage /></IsProfileComplete></IsAuthenticated>} />
            
          </Routes>
        </div>
        {!hideFooterOnRoutes.includes(location.pathname) && <Footer />}
      </div>    
  );
}

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App; 