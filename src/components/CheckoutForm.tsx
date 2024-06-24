// src/components/CheckoutForm.tsx
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';


const CARD_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#87bbfd',
      },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
};

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setErrorMessage(error.message || 'Une erreur s\'est produite.');
      } else {
        setErrorMessage(null);
        console.log('PaymentMethod:', paymentMethod);
        // Envoyer le paymentMethod.id à votre serveur pour créer un paiement
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_OPTIONS} />
      <button type="submit" disabled={!stripe}>
        Payer
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
