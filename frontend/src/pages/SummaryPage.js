import React, {useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SummaryPage.css';

const SummaryPage = () => {
  const location = useLocation();
  const checkoutData = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkoutData) {
      navigate('/abonnement');
    }
  }, [checkoutData, navigate]);

  if (!checkoutData) {
    // While redirecting, avoid rendering the rest of the component
    return null;
  }

  return (
  <div className="summary-container">
    <div className="summary-header">
      <h2>Oppsummering og Betaling</h2>
    </div>

    <div className="summary-details">
      <h3>Abonnement: KonservativMatch Premium</h3>

      <div className="summary-box">
        <strong className="summary-label">Bindingstid:</strong>
        <div className="summary-divider"></div>
        <strong className="summary-value">{checkoutData.bindingstid}</strong>
      </div>

      <div className="summary-box">
        <strong className="summary-label">Pris:</strong>
        <div className="summary-divider"></div>
        <strong className="summary-value">{checkoutData.pris}</strong>
      </div>

      <div className="summary-box">
        <strong className="summary-label">Automatisk fornyelse:</strong>
        <div className="summary-divider"></div>
        <strong className="summary-value">{checkoutData.autoRenew ? 'Ja' : 'Nei'}</strong>
      </div>

      <div className="summary-box">
        <strong className="summary-label">Betalingsmetode:</strong>
        <div className="summary-divider"></div>
        <strong className="summary-value">{checkoutData.paymentMethod === 'vipps' ? 'Vipps' : 'VISA / Mastercard'}</strong>
      </div>

      <div className="summary-box">
        <strong className="summary-label-bold">Totalt å betale nå:</strong>
        <div className="summary-divider"></div>
        <strong className="summary-value-bold">{checkoutData.total}</strong>
        </div>
          <hr className="checkout-divider" />
          <div>betalingsinfo</div>
          <hr className="checkout-divider" />
        </div>
      <button className="summary-button">
        Fullfør Betaling
      </button>
    </div>
  );
};

export default SummaryPage;
