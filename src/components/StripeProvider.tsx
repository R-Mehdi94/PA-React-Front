import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PVJ9d09gBFIEHXvAMxdHk2ElO5kWkr35CEuw7FE9B2VqMhMRgxW0fCunIl5eYPRF6tvaItemdJn9cWyloHQjOOO00VlVtptQh');

interface StripeProviderProps {
  children: ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;