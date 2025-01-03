import React, { useEffect, useState } from 'react';
import '../../styles/subscription/SubManagementPage.css';
import {
  getSubscriptionStatus,
  updateAutoRenewal,
  upgradeSubscription,
} from '../../api/SubscriptionAPI';
import { useAuth0 } from '@auth0/auth0-react';

const SubManagementPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRenew, setAutoRenew] = useState(false);
  const { user } = useAuth0();

  useEffect(() => {
    const getSubscriptionDetails = async () => {
      try {
        const response = await getSubscriptionStatus(user.sub);
        setSubscription(response);
        setAutoRenew(response.auto_renew);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    getSubscriptionDetails();
  }, []);

  const handleAutoRenewChange = async () => {
    try {
      setAutoRenew(!autoRenew);
      await updateAutoRenewal(!autoRenew);
    } catch (error) {
      console.error('Error updating auto-renewal:', error);
    }
  };

  const handleUpgrade = async (newType) => {
    try {
      await upgradeSubscription(newType);
      const updatedSubscription = await getSubscriptionStatus(user.sub);
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('no-NO', { // Use Norwegian locale
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <div>Loading...</div>;

  const { subscription_type, start_date, end_date, payment_method, status } = subscription;

  return (
    <div className="sub-man-container">
      <h1>Administrer ditt abonnement</h1>
      <div class="checkout-summary">

        <div className="summary-box">
          <strong className="summary-label">Status:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{status === 'active' ? 'Aktivt' : 'Inaktivt'}</strong>
        </div>

        <div className="summary-box">
          <strong className="summary-label">Abonnementstype:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{subscription_type}</strong>
        </div>

        <div className="summary-box">
          <strong className="summary-label">Startdato:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{formatDate(start_date)}</strong>
        </div>

        <div className="summary-box">
          <strong className="summary-label">Sluttdato:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{formatDate(end_date)}</strong>
        </div>

        <div className="summary-box">
          <strong className="summary-label">Betalingsmetode:</strong>
          <div className="summary-divider"></div>
          <strong className="summary-value">{payment_method || 'Ingen betalingsmetode'}</strong>
        </div>

      </div>

      <div className="sub-man-auto-renew">
        <label>
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={handleAutoRenewChange}
          />
          Automatisk fornyelse
        </label>
      </div>

      <div className="sub-man-upgrade-options">
        <h2>Oppgrader abonnement</h2>
        <button
          className={subscription_type === '6 months' ? 'disabled' : ''}
          onClick={() => handleUpgrade('3 months')}
          disabled={subscription_type === '6 months' || subscription_type === '3 months'}
        >
          3 måneder
        </button>
        <button
          className={subscription_type === '6 months' ? 'disabled' : ''}
          onClick={() => handleUpgrade('6 months')}
          disabled={subscription_type === '6 months'}
        >
          6 måneder
        </button>
      </div>
    </div>
  );
};

export default SubManagementPage;
