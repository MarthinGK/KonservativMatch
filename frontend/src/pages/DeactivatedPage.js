import React from 'react';
import { updateProfileActiveStatus } from '../api/UserAPI';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/DeactivatedPage.css'; // Create this CSS file for styling
import Logo from '../components/images/LogoTransparent.webp';

const DeactivatedPage = () => {
  const { user } = useAuth0();

  const reactivateProfile = async () => {
    try {
      await updateProfileActiveStatus(user.sub, true);
      alert('Din profil er aktivert!');
      window.location.href = '/'; // Redirect to the home page
    } catch (error) {
      console.error('Error reactivating profile:', error);
      alert('Kunne ikke aktivere profilen. Vennligst prøv igjen.');
    }
  };

  return (
    <div className="deactivated-page">
      <img
        src={Logo}
        alt="Logo"
        className="deactivated-page-logo"
      />
      <h1 className='deactivated-page-h1'>Din profil er deaktivert</h1>
      <p className='deactivated-page-p'>Aktiver profilen din for å fortsette til KonservativMatch.</p>
      <button onClick={reactivateProfile} className="deactivated-page-reactivate-button">
        Aktiver Profil
      </button>
    </div>
  );
};

export default DeactivatedPage;
