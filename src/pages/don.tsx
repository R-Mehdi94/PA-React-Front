import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { TypeTransaction, createTransaction, createVisiteur, getVisiteurParMail, sendEmailDon, updateVisiteur, verifVisiteur } from "../api/apiService";
import '../css/don.css'

const Don: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [nom, setNom] = useState<string>('');
  const [prenom, setPrenom] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [profession, setProfession] = useState<string>('');
  const [numTel, setNumTel] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoading(true);
    let visiteur;

    setError(null);
    setSuccess(null);
    event.preventDefault();

    if (age < 16) {
      setIsLoading(false);
      setError("L'âge minimum requis est de 16 ans.");
      return;
    }

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

      try {
        const verifVisiteurConst = {
          email: email
        };
        const verif = await verifVisiteur(verifVisiteurConst);
        // @ts-ignore
        if (verif === "Visiteur non existant") {
          visiteur = await createVisiteur({ email: email, nom: nom, prenom: prenom, age: age, numTel: numTel, profession: profession, estBanie: false });
        } else {
          visiteur = await getVisiteurParMail(email);
          // @ts-ignore
          if(visiteur.Visiteurs[0].estBanie){
            setIsLoading(false);
            setError('Vous êtes banni');
            return;
          }
            // @ts-ignore
          await updateVisiteur({ id: visiteur.Visiteurs[0].id, email: email, nom: nom, prenom: prenom, age: age, numTel: numTel, profession: profession });
        }
  
      } catch (error) {
        console.error('Error verifying visitor', error);
        throw error;
      }


      const transaction = {
        //@ts-ignore
        visiteur: visiteur.data?.id ?? visiteur.Visiteurs[0]?.id,
        montant: amount,
        methodePaiement: paymentMethodResult.paymentMethod?.id || '',
        type: TypeTransaction.Don,
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
              placeholder="Entrer votre email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Entrer votre nom"
            />
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prénom</label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Entrer votre prénom"
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Âge</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="Entrer votre âge"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <input
              id="profession"
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Entrer votre profession"
            />
          </div>
          <div className="form-group">
            <label htmlFor="numTel">Numéro de téléphone</label>
            <input
              id="numTel"
              type="tel"
              value={numTel}
              onChange={(e) => setNumTel(e.target.value)}
              placeholder="Entrer votre numéro de téléphone"
            />
          </div>
          <div className="form-group">
            <label>Information de la carte</label>
            <CardElement className="card-element" />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Montant du don</label>
            <input
              id="amount"
              type="number"
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Rentrer le montant"
            />
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
