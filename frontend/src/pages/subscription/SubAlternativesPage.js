import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/subscription/SubAlternativesPage.css';
import vippsLogo from '../../components/images/VippsLogo.png';
import stripeLogo from '../../components/images/CardsLogo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SubAlternativesPage = () => {

  const navigate = useNavigate();

  const handleSubscriptionSelection = (plan) => {
    const planDetails = {
      '1-måned': { bindingstid: '1 måned', pris: '129 kr / mnd', total: '129 kr' },
      '3-måneder': { bindingstid: '3 måneder', pris: '119 kr / mnd', total: '357 kr' },
      '6-måneder': { bindingstid: '6 måneder', pris: '99 kr / mnd', total: '594 kr' },
    };

    // Navigate to checkout with plan details
    navigate('/utsjekk', { state: planDetails[plan] });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>KonservativMatch Premium</h1>
      </div>

      <div className="plans">
        {/* Free Plan */}
        <div className="plan">
          <h2>Gratis Plan</h2>
          <p className="month">Ingen kostnad, begrensede funksjoner</p>
          <ul className="features">
            <li className="free">Maks 3 likes per dag</li>
            <li className="free">Kan ikke sende meldinger</li>
            <li className="free">Kan ikke se hvem som har likt deg</li>
          </ul>
          
        </div>

        {/* Premium Plan */}
        <div className="plan">
          <h2>Premium Plan</h2>
          <p className="month">1 måned binding</p>
          <p className="price">149 kr / mnd</p>
          <ul className="features">
            <li><i className="fas fa-check-circle"></i> Ubegrenset likes</li>
            <li><i className="fas fa-check-circle"></i> Send meldinger</li>
            <li><i className="fas fa-check-circle"></i> Se hvem som har likt deg</li>
          </ul>
          <div className="payment-methods">
            <img className='payment-vipps-logo' src={vippsLogo} alt="Vipps" title="Betal med Vipps" />
            <img className='payment-stripe-logo' src={stripeLogo} alt="Stripe" title="Betal med Stripe" />
          </div>
          <div className="cta">
          <button onClick={() => handleSubscriptionSelection('1-måned')}>Kjøp plan: 1 måned</button>
          </div>
        </div>

        <div className="plan">
          <h2>Premium Plan</h2>
          <p className="month">3 måneder binding</p>
          <p className="price">119 kr / mnd</p>
          <ul className="features">
            <li><i className="fas fa-check-circle"></i> Ubegrenset likes</li>
            <li><i className="fas fa-check-circle"></i> Send meldinger</li>
            <li><i className="fas fa-check-circle"></i> Se hvem som har likt deg</li>
          </ul>
          <div className="payment-methods">
          <img className='payment-vipps-logo' src={vippsLogo} alt="Vipps" title="Betal med Vipps" />
          <img className='payment-stripe-logo' src={stripeLogo} alt="Stripe" title="Betal med Stripe" />
          </div>
          <div className="cta">
          <button onClick={() => handleSubscriptionSelection('3-måneder')}>Kjøp plan: 3 måneder</button>
          </div>
        </div>

        <div className="plan">
          <h2>Premium Plan</h2>
          <p className="month">6 måneder binding</p>
          <p className="price">99 kr / mnd</p>
          <ul className="features">
            <li><i className="fas fa-check-circle"></i> Ubegrenset likes</li>
            <li><i className="fas fa-check-circle"></i> Send meldinger</li>
            <li><i className="fas fa-check-circle"></i> Se hvem som har likt deg</li>
          </ul>
          <div className="payment-methods">
          <img className='payment-vipps-logo' src={vippsLogo} alt="Vipps" title="Betal med Vipps" />
          <img className='payment-stripe-logo' src={stripeLogo} alt="Stripe" title="Betal med Stripe" />
          </div>
          <div className="cta">
          <button onClick={() => handleSubscriptionSelection('6-måneder')}>Kjøp plan: 6 måneder</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SubAlternativesPage;