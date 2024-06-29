import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { TypeTransaction, createTransaction, sendEmailDon } from "../api/apiService";
import '../css/don.css'
const Don: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card Element is not available.");
      return;
    }

    try {
      const paymentMethodResult = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodResult.error) {
        setError(paymentMethodResult.error.message || "An error occurred while creating the payment method.");
        return;
      }

      const transaction = {
        emailVisiteur: email,
        montant: amount,
        methodePaiement: paymentMethodResult.paymentMethod?.id || '',
        type: TypeTransaction.Don,
        dateTransaction: new Date(),
      };

      const response = await createTransaction(transaction);

      const clientSecret = response.clientSecret;

      // Vérifiez l'état du PaymentIntent avant de tenter de le confirmer
      const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
      const emailDon = {
        mail: email,
        montant: amount,
      };

      if (paymentIntent.paymentIntent?.status === 'succeeded') {
        await sendEmailDon(emailDon);
        setSuccess("Donation successful!");
        return;
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodResult.paymentMethod.id,
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message || "An error occurred while confirming the payment.");
      } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
        setSuccess("Donation successful!");
        await sendEmailDon(emailDon);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      setError(error.response ? error.response.data.error.message : error.message || "An internal error occurred.");
      console.error("Payment Error:", error.response ? error.response.data : error);
    }
  };

  return (
    <div>
      <center>
        <h1>Faite un don !</h1>
      </center>
      <div className="container">

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Donation Amount</label>
            <input 
              id="amount"
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))} 
              placeholder="Enter donation amount" 
            />
          </div>
          <div className="form-group">
            <label>Card Details</label>
            <CardElement className="card-element" />
          </div>
          <button type="submit" disabled={!stripe}>Donate</button>
          {error && <div className="response-message-error">{error}</div>}
          {success && <div className="response-message-success">{success}</div>}
        </form>
      </div>
    </div>

  );
};
export default Don;