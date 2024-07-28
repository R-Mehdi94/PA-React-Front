import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { TypeTransaction, createTransaction, sendEmailDon } from "../../api/apiService";
import '../../css/don.css'
const Don: React.FC = () => {
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoading(true);

    setError(null);
    setSuccess(null);
    event.preventDefault();

    if (!stripe || !elements) {
      setIsLoading(false);
      setError("Stripe has not been properly initialized.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsLoading(false);
      setError("L'élément de carte n'est pas disponible.");
      return;
    }

    try {

      const paymentMethodResult = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodResult.error) {
        setIsLoading(false);
        setError(paymentMethodResult.error.message || "Une erreur s'est produite lors de la création du mode de paiement.");
        return;
      }

      const transaction = {
        adherent: storedUser.adherent.id,
        montant: amount,
        methodePaiement: paymentMethodResult.paymentMethod?.id || '',
        type: TypeTransaction.Don
      };

      const response = await createTransaction(transaction);

      const clientSecret = response.clientSecret;

      // Vérifiez l'état du PaymentIntent avant de tenter de le confirmer
      const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
      const emailDon = {
        mail: storedUser.adherent.email,
        montant: amount,
      };

      if (paymentIntent.paymentIntent?.status === 'succeeded') {
        await sendEmailDon(emailDon);
        setIsLoading(false);
        setSuccess("Don réussi !");
        return;
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodResult.paymentMethod.id,
      });

      if (paymentResult.error) {
        setIsLoading(false);
        setError(paymentResult.error.message || "Une erreur s'est produite lors de la confirmation du paiement.");
      } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
        setIsLoading(false);
        setSuccess("Don réussi !");
        await sendEmailDon(emailDon);
      } else {
        setIsLoading(false);
        setError("Une erreur inattendue est apparue. Veuillez réessayer.");
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error.response ? error.response.data.error.message : error.message || "Une erreur interne a eu lieu.");
      console.error("Payment Error:", error.response ? error.response.data : error);
    }
  };



  return (
    <div>
      <center>
      {isLoading && <center>
          <br />
          <br />
          <div className="loader">
            <div className="square-1 square"></div>
            <div className="square-2 square"></div>
          </div>
      </center>}

        <h1>Faite un don !</h1>
      </center>
      <div className="container">

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Montant du don</label>
            <input 
              id="amount"
              type="number" 
              onChange={(e) => setAmount(Number(e.target.value))} 
              placeholder="Rentrer le montant" 
            />
          </div>
          <div className="form-group">
            <label>Information de la carte</label>
            <CardElement className="card-element" />
          </div>
          <button type="submit" disabled={!stripe}>Faire un don !</button>
          {error && <div className="response-message-error">{error}</div>}
          {success && <div className="response-message-success">{success}</div>}
        </form>
      </div>
    </div>

  );
};
export default Don;