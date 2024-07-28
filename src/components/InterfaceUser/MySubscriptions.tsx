import React, { useEffect, useState } from "react";
import ProfilNavigation from "../../pages/ProfilNavigation";
import { Cotisation, createCotisation, getCotisationsUser} from "../../api/apiService";
import "../../css/profil.css"; 
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { TypeTransaction, createTransaction} from "../../api/apiService";

const stripePromise = loadStripe("pk_test_51PVJ9d09gBFIEHXvAMxdHk2ElO5kWkr35CEuw7FE9B2VqMhMRgxW0fCunIl5eYPRF6tvaItemdJn9cWyloHQjOOO00VlVtptQh"); 

const PaiementAdherent: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cotisationType, setCotisationType] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCotisationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setCotisationType(selectedType)
    switch (selectedType) {
      
      case 'etudiant':
        setAmount(10);
        break;
      case 'autre':
        setAmount(15);
        break;
      case 'cadre':
        setAmount(25);
        break;
      case "chefEntreprise":
        setAmount(35);
        break;
      default:
        setAmount(0);
    }
  };

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
        montant: amount,
        methodePaiement: paymentMethodResult.paymentMethod?.id || '',
        type: TypeTransaction.PaiementCotisations,
        adherent: storedUser.adherent.id,
      };

      const response = await createTransaction(transaction);
      const clientSecret = response.clientSecret;

      const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);

      /*const emailDon = {
        mail: email,
        montant: amount,
      };*/

      if (paymentIntent.paymentIntent?.status === 'succeeded') {
        //await sendEmailDon(emailDon);
        // @ts-ignore
        await createCotisation({type:cotisationType, Ajours:true, adherent: storedUser.adherent.id});
        setIsLoading(false);
        setSuccess("Cotisation réussie !");
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
        setSuccess("Cotisation réussie !");
        //await sendEmailDon(emailDon);
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
        {isLoading && (
          <center>
            <br />
            <br />
            <div className="loader">
              <div className="square-1 square"></div>
              <div className="square-2 square"></div>
            </div>
          </center>
        )}
        <h1>Paiement de la cotisation</h1>
      </center>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cotisationType">Type de cotisation</label>
            <select 
              id="cotisationType" 
              value={cotisationType} 
              onChange={handleCotisationChange}
            >
              <option value="">Sélectionner le type de cotisation</option>
              <option value="etudiant">Étudiant - 10€</option>
              <option value="autre">Autres - 15€</option>
              <option value="cadre">Cadres - 25€</option>
              <option value="chefEntreprise">Chef d'entreprise - 35€</option>
            </select>
          </div>
          <div className="form-group">
            <label>Information de la carte</label>
            <CardElement className="card-element" />
          </div>
          <button type="submit" disabled={!stripe}>Payer</button>
          {error && <div className="response-message-error">{error}</div>}
          {success && <div className="response-message-success">{success}</div>}
        </form>
      </div>
      <br/>
      <br/>
    </div>
  );
};

const MySubscriptions: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noValidSubscription, setNoValidSubscription] = useState<boolean>(false);
  const [nearExpiration, setNearExpiration] = useState<boolean>(false);

  useEffect(() => {
    const fetchCotisations = async () => {
      try {
        const response = await getCotisationsUser(storedUser.adherent.id);
        if (response && response.Cotisations) {
          // Tri des cotisations par date, la plus récente en haut
          const sortedCotisations = response.Cotisations.sort((a: Cotisation, b: Cotisation) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

          setCotisations(sortedCotisations);

          // Vérifier s'il y a des cotisations valides
          const hasValidSubscription = sortedCotisations.some((cotisation: { date: string; }) => isValid(cotisation.date));
          setNoValidSubscription(!hasValidSubscription);

          // Vérifier s'il y a des cotisations qui expirent dans moins de 2 semaines
          const hasNearExpiration = sortedCotisations.some((cotisation: { date: string; }) => isNearExpiration(cotisation.date) && !isExpired(cotisation.date));
          setNearExpiration(hasNearExpiration);

        } else {
          console.log('Error fetching subscriptions');
        }
      } catch (err) {
        console.log('Error fetching subscriptions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCotisations();
  }, [storedUser.adherent.id]);

  const isValid = (date: string) => {
    const currentDate = new Date();
    const cotisationDate = new Date(date);
    cotisationDate.setFullYear(cotisationDate.getFullYear() + 1);
    return cotisationDate.getTime() >= currentDate.getTime();
  };

  const isNearExpiration = (date: string) => {
    const currentDate = new Date();
    const cotisationDate = new Date(date);
    cotisationDate.setFullYear(cotisationDate.getFullYear() + 1);
    const timeDifference = cotisationDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference <= 14 && daysDifference > 0;
  };

  const isExpired = (date: string) => {
    const currentDate = new Date();
    const cotisationDate = new Date(date);
    cotisationDate.setFullYear(cotisationDate.getFullYear() + 1);
    return cotisationDate.getTime() < currentDate.getTime();
  };

  if (isLoading) {
    return (
      <center>
        <div className="loader">
          <div className="square-1 square"></div>
          <div className="square-2 square"></div>
        </div>
      </center>
    );
  }

  return (
    <div className="profile-container">
      <ProfilNavigation />
      <div className="profile-details">
        <h2>Mes cotisations</h2>
        {noValidSubscription && (
          <div>
            <p className="error-message">Vous n'avez aucune cotisation à jour.</p>
            <Elements stripe={stripePromise}>
              <PaiementAdherent />
            </Elements>
          </div>
        )}
        {nearExpiration && (
          <p className="warning-message">Votre cotisation expire dans moins de 2 semaines.</p>
        )}
        <div className="subscriptions-list">
          {cotisations.map((cotisation) => (
            <div key={cotisation.id} className={`subscription-item card ${isValid(cotisation.date) ? 'valid' : 'invalid'}`}>
              <h3>Cotisation ID: {cotisation.id}</h3>
              <p>Type: {cotisation.type}</p>
              <p>Date: {new Date(cotisation.date).toLocaleDateString()}</p>
              <p>Valide: {isValid(cotisation.date) ? "Oui" : "Non"}</p>
              {isNearExpiration(cotisation.date) && !isExpired(cotisation.date) && (
                <p className="warning-message">Cette cotisation expire dans moins de 2 semaines.</p>
              )}
              {isExpired(cotisation.date) && (
                <p className="error-message">Cette cotisation a expiré.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MySubscriptions;
