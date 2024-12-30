import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CheckoutPage.css';
import vippsLogo from '../components/images/VippsLogo.png';
import stripeLogo from '../components/images/CardsLogo.png';

const CheckoutPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isAutoRenew, setIsAutoRenew] = useState(false); // Track auto-renewal option
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const planDetails = location.state;

  useEffect(() => {
    if (!planDetails) {
      navigate('/abonnement');
    }
  }, [planDetails, navigate]);

  if (!planDetails) {
    // While redirecting, avoid rendering the rest of the component
    return null;
  }
  
  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setError(false); // Remove error once a payment method is selected
  };

  const handleNextStep = () => {
    if (!selectedPaymentMethod) {
      setError(true); // Show error if no payment method is selected
      return;
    }

    // Navigate to the summary page with all necessary data
    navigate('/oppsummering', {
      state: { ...planDetails, paymentMethod: selectedPaymentMethod, autoRenew: isAutoRenew },
    });
  };

  return (
    <div className="checkout-container">
      {/* Subscription Summary */}

      <div class="checkout-summary">
        <h2>Abonnement: KonservativMatch Premium</h2>

        <div className="summary-box">
          <strong className="summary-label">Bindingstid:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{planDetails.bindingstid}</strong>
        </div>

        <div className="summary-box">
          <strong className="summary-label">Pris:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{planDetails.pris}</strong>
        </div>

        <div className="summary-box">
          <strong className="summary-label">Totalt å betale nå:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{planDetails.total}</strong>
        </div>

      </div>

      <hr className="checkout-divider" />

      {/* Payment Options */}
      <h2>Velg betalingsmetode</h2>
      <div className="payment-options">
        <label className={`payment-option ${selectedPaymentMethod === 'vipps' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="payment-method"
            value="vipps"
            onChange={() => handlePaymentMethodChange('vipps')}
          />
          <img className="checkout-vipps-logo" src={vippsLogo} alt="Vipps" title="Betal med Vipps" />
          Betal med Vipps
        </label>

        <label className={`payment-option ${selectedPaymentMethod === 'stripe' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="payment-method"
            value="stripe"
            onChange={() => handlePaymentMethodChange('stripe')}
          />
          <img className="checkout-stripe-logo" src={stripeLogo} alt="Stripe" />
          Betal med VISA eller Mastercard
        </label>
      </div>

      {/* Automatic Renewal Checkbox */}
      <hr className="checkout-divider" />
      <div className="auto-renewal">
        <input
          type="checkbox"
          id="auto-renew"
          checked={isAutoRenew}
          onChange={() => setIsAutoRenew(!isAutoRenew)}
        />
        <label htmlFor="auto-renew">Jeg ønsker automatisk fornyelse</label>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">Vennligst velg en betalingsmetode</p>}

      {/* Next Button */}
      <button
        className={`checkout-button ${!selectedPaymentMethod ? 'disabled' : ''}`}
        onClick={handleNextStep}
        disabled={!selectedPaymentMethod} // Disable button if no payment method is selected
      >
        Videre
      </button>
    </div>
  );
};

export default CheckoutPage;
