import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { getSubscriptionStatus } from '../api/SubscriptionAPI';

const IsSubscribed = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [status, setStatus] = useState({
    isSubscribed: false,
    loading: true,
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      if (isAuthenticated && user) {
        try {
          const subscriptionStatus = await getSubscriptionStatus(user.sub);
          const isSubscribed = subscriptionStatus.status === 'active';

          setStatus({
            isSubscribed,
            loading: false,
          });

          // Cache the subscription status in localStorage
          localStorage.setItem('subscription_status', JSON.stringify(isSubscribed));
        } catch (error) {
          console.error('Error fetching subscription status:', error);
          setStatus({ isSubscribed: false, loading: false });
        }
      } else {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchSubscription();
  }, [isAuthenticated, user]);

  if (isLoading || status.loading) return <div>Loading...</div>;

  if (!status.isSubscribed) {
    return <Navigate to="/abonnement" />;
  }

  return children;
};

export default IsSubscribed;
