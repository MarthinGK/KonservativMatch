import React, { useEffect, useState } from 'react';
import { getSubscriptionStatus } from '../../api/SubscriptionAPI'; // Ensure the API path is correct
import SubAlternativesPage from './SubAlternativesPage'; // Page to show if not subscribed
import SubManagementPage from './SubManagementPage'; // Page to show if subscribed
import { useAuth0 } from '@auth0/auth0-react';

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth0();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const subscription = await getSubscriptionStatus(user.sub);
        console.log("SUBSCRIPTION STATUS: ", subscription)
        setIsSubscribed(subscription.status === 'active');
      } catch (error) {
        console.error('Error fetching subscription status3:', error);
        setIsSubscribed(false); // Default to not subscribed in case of an error
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isSubscribed ? <SubManagementPage /> : <SubAlternativesPage />;
};

export default SubscriptionPage;
