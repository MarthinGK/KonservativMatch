import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './pages/Navbar';
import Footer from './pages/footer/Footer';

import Home from './pages/HomePage';
import Explore from './pages/Explore';
import ProfileSetup from './pages/ProfileSetup';
import Search from './pages/SearchPage';
import IsAuthenticated from './components/IsAuthenticated';
import IsProfileComplete from './components/IsProfileComplete';
import EmailVerification from './pages/EmailVerification';
import { checkUserInDB, updateUserActivity, fetchProfileActiveStatus } from './api/UserAPI';

import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/EditProfilePage';
import EditAccountPage from './pages/EditAccountPage';
import LikesPage from './pages/LikesPage';
import MessagesPage from './pages/MessagesPage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import CheckoutPage from './pages/subscription/CheckoutPage';
import SummaryPage from './pages/subscription/SummaryPage';

import ConditionsPage from './pages/footer/ConditionsPage';
import AboutUsPage from './pages/footer/AboutUsPage';
import PrivacyPolicyPage from './pages/footer/PrivacyPolicyPage';
import ContactPage from './pages/footer/ContactPage';
import FAQPage from './pages/footer/FAQPage';

import DeactivatedPage from './pages/DeactivatedPage';

import IsSubscribed from './components/IsSubscribed';

import { SpeedInsights } from '@vercel/speed-insights/react';

import Logo from './components/images/LogoTransparent.webp'; // Path to your logo

import './styles/App.css'; // Global CSS styles
import './styles/LoadingSpinner.css'; // Import CSS for spinner


function AppLayout() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const hideFooterOnRoutes = ['/messages', '/profile-setup', '/deactivated']; // Paths without footer
  const hideNavbarOnRoutes = ['/deactivated']; // Paths without navbar
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (isAuthenticated && user) {
          await getAccessTokenSilently();

          const checkUser = await checkUserInDB(user); // Check or create user in the database
          console.log("user check complete: ", checkUser)
          await updateUserActivity(user.sub); // Update user activity timestamp
          const isActive = await fetchProfileActiveStatus(user.sub);
          if (!isActive) {
            navigate('/deaktivert'); // Redirect to deactivated page if profile is inactive
          }
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        setIsLoading(false); // Stop the loading spinner
      }
    };

    initializeApp();
  }, [isAuthenticated, user, navigate, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <img src={Logo} alt="Loading..." className="spinner-logo" />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="main-content">
        {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <IsProfileComplete><Explore /></IsProfileComplete> : <Home />} />
          <Route path="/profile-setup" element={<IsAuthenticated><ProfileSetup /></IsAuthenticated>} />

          <Route 
            path="/messages" 
            element={
              <IsAuthenticated>
                <IsProfileComplete>
                  <IsSubscribed>
                    <MessagesPage />
                  </IsSubscribed>
                </IsProfileComplete>
              </IsAuthenticated>
            }
          />

          <Route path="/likes" element={<IsAuthenticated><IsProfileComplete><LikesPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/search" element={<IsAuthenticated><IsProfileComplete><Search /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/bruker/:brukerId" element={<IsAuthenticated><IsProfileComplete><ProfilePage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/EmailVerification" element={<EmailVerification />} />

          <Route path="/profil" element={<IsAuthenticated><IsProfileComplete><ProfileEditPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/personlig-info" element={<IsAuthenticated><IsProfileComplete><EditAccountPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/abonnement" element={<IsAuthenticated><IsProfileComplete><SubscriptionPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/utsjekk" element={<IsAuthenticated><IsProfileComplete><CheckoutPage /></IsProfileComplete></IsAuthenticated>} />
          <Route path="/oppsummering" element={<IsAuthenticated><IsProfileComplete><SummaryPage /></IsProfileComplete></IsAuthenticated>} />

          <Route path="/vilkår" element={<ConditionsPage />} />
          <Route path="/om-oss" element={<AboutUsPage />} />
          <Route path="/personvern" element={<PrivacyPolicyPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/deaktivert" element={<DeactivatedPage />} />
        </Routes>
        {/* <SpeedInsights /> */}
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
