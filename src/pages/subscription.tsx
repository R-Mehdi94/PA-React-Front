import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { TypeTransaction, createAdherent, createCotisation, createTransaction, sendEmailAdherer } from "../api/apiService";
import '../css/subcription.css';

export interface Visiteur {
  email: string;
  nom: string;
  prenom: string;
  age: number;
  numTel: string;
  adresse: string;
  profession: string;
  estBenevole: boolean;
}

function generatePassword(length: number = 12): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }
  return password;
}

const Adherer: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [membershipType, setMembershipType] = useState<string>('etudiant'); // Default to etudiant
  const [visiteur, setVisiteur] = useState<Visiteur>({
    email: '',
    nom: '',
    prenom: '',
    age: 0,
    numTel: '',
    adresse: '',
    profession: '',
    estBenevole: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    switch (membershipType) {
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
  }, [membershipType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVisiteur({ ...visiteur, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setVisiteur({ ...visiteur, [name]: checked });
  };

  const handleMembershipChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMembershipType(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    let adherent;

    event.preventDefault();

    if (!stripe || !elements) {
      setIsLoading(false);
      setError("Stripe n'a pas été correctement initialisé.");
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

      if (visiteur === undefined) {
        setIsLoading(false);
        setError("Veuillez remplir tous les champs.");
        return;
      }

      const newPassword = generatePassword();

      adherent = await createAdherent({
        email: visiteur.email,
        motDePasse: newPassword,
        nom: visiteur.nom,
        adresse: visiteur.adresse,
        estBenevole: visiteur.estBenevole,
        prenom: visiteur.prenom,
        age: visiteur.age,
        numTel: visiteur.numTel,
        profession: visiteur.profession,
        estBanie: false
      });

      console.log(adherent)

      if(adherent===null){
        setIsLoading(false);
        setError("Mail déjà utilisé");
        return;
      }



      const transaction = {
        adherent: adherent.data?.id,
        montant: amount,
        methodePaiement: paymentMethodResult.paymentMethod?.id || '',
        type: TypeTransaction.PaiementCotisations,
      };

      const response = await createTransaction(transaction);

      const clientSecret = response.clientSecret;

      const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
      const emailSub = {
        mail: visiteur.email,
        prenom: visiteur.prenom,
        motDePasse: newPassword
      };

      if (paymentIntent.paymentIntent?.status === 'succeeded') {
        //@ts-ignore
        await createCotisation({ type: membershipType, Ajours: true, adherent: adherent.data.id });
        setIsLoading(false);
        setSuccess("Inscription réussie !");
        console.log("Email: ", emailSub);
        await sendEmailAdherer(emailSub);
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
        setSuccess("Inscription réussie !");
        await sendEmailAdherer(emailSub);
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
        <h1>Adhérer à ECAF !</h1>
      </center>
      {isLoading && (
        <center>
          <br />
          <div className="loader">
            <div className="square-1 square"></div>
            <div className="square-2 square"></div>
          </div>
          <br />
          <br />
        </center>
      )}
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={visiteur.email}
              onChange={handleInputChange}
              placeholder="Entrer votre email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={visiteur.nom}
              onChange={handleInputChange}
              placeholder="Entrer votre nom"
            />
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prénom</label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              value={visiteur.prenom}
              onChange={handleInputChange}
              placeholder="Entrez votre prénom"
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Âge</label>
            <input
              id="age"
              name="age"
              type="number"
              value={visiteur.age}
              onChange={handleInputChange}
              placeholder="Entrer votre âge"
            />
          </div>
          <div className="form-group">
            <label htmlFor="numTel">Numéro de téléphone</label>
            <input
              id="numTel"
              name="numTel"
              type="text"
              value={visiteur.numTel}
              onChange={handleInputChange}
              placeholder="Entrer votre numéro de téléphone"
            />
          </div>
          <div className="form-group">
            <label htmlFor="adresse">Adresse</label>
            <textarea
              id="adresse"
              name="adresse"
              value={visiteur.adresse}
              onChange={handleInputChange}
              placeholder="Entrer votre adresse"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <input
              id="profession"
              name="profession"
              type="text"
              value={visiteur.profession}
              onChange={handleInputChange}
              placeholder="Entrer votre profession"
            />
          </div>
          <div className="form-group">
            <label htmlFor="estBenevole">
              <input
                id="estBenevole"
                name="estBenevole"
                type="checkbox"
                checked={visiteur.estBenevole}
                onChange={handleCheckboxChange}
              />
              Je souhaite être bénévole
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="membershipType">Membership Type</label>
            <select id="membershipType" name="membershipType" value={membershipType} onChange={handleMembershipChange}>
              <option value="etudiant">Étudiant - 10€</option>
              <option value="autre">Autres - 15€</option>
              <option value="cadre">Cadres - 25€</option>
              <option value="chefEntreprise">Chef d'entreprise - 35€</option>
            </select>
          </div>
          <div className="form-group">
            <label>Card Details</label>
            <CardElement className="card-element" />
          </div>
          <button type="submit" disabled={!stripe}>S'inscrire</button>
          {error && <div className="response-message error">{error}</div>}
          {success && <div className="response-message success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default Adherer;