import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { TypeTransaction, createTransaction, createVisiteur, sendEmailAdherer } from "../api/apiService";
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

const Adherer: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [membershipType, setMembershipType] = useState<string>('10');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVisiteur({ ...visiteur, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setVisiteur({ ...visiteur, [name]: checked });
    };

    const handleMembershipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMembershipType(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        setError(null);
        setSuccess(null);

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
                emailVisiteur: visiteur.email,
                montant: parseFloat(membershipType),
                methodePaiement: paymentMethodResult.paymentMethod?.id || '',
                type: TypeTransaction.PaiementCotisations,
            };

            const response = await createTransaction(transaction);

            const clientSecret = response.clientSecret;

            // Vérifiez l'état du PaymentIntent avant de tenter de le confirmer
            const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
            const emailSub = {
                mail: visiteur.email,
                prenom: visiteur.prenom,
            };

            const responseVisiteur = await createVisiteur(visiteur);
            if(responseVisiteur.status === 209){
                setError("Le mail est déjà utilisé.");
                return;
            }

            if (paymentIntent.paymentIntent?.status === 'succeeded') {
                setSuccess("Subscription successful!");
                await sendEmailAdherer(emailSub);
                return;
            }

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodResult.paymentMethod.id,
            });

            if (paymentResult.error) {
                setError(paymentResult.error.message || "An error occurred while confirming the payment.");
            } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
                setSuccess("Subscription successful!");
                await sendEmailAdherer(emailSub);
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
                <h1>Adhérer à ECAF !</h1>
            </center>
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
                            placeholder="Enter your email"
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
                            placeholder="Enter your last name"
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
                            placeholder="Enter your first name"
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
                            placeholder="Enter your age"
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
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="adresse">Adresse</label>
                        <textarea
                            id="adresse"
                            name="adresse"
                            value={visiteur.adresse}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
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
                            placeholder="Enter your profession"
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
                        <label>Membership Type</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="10"
                                    checked={membershipType === '10'}
                                    onChange={handleMembershipChange}
                                />
                                <span>Étudiant - 10€</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="25"
                                    checked={membershipType === '25'}
                                    onChange={handleMembershipChange}
                                />
                                <span>Cadres - 25€</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="35"
                                    checked={membershipType === '35'}
                                    onChange={handleMembershipChange}
                                />
                                <span>Chef d'entreprise - 35€</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Card Details</label>
                        <CardElement className="card-element" />
                    </div>
                    <button type="submit" disabled={!stripe}>Subscribe</button>
                    {error && <div className="response-message error">{error}</div>}
                    {success && <div className="response-message success">{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default Adherer;
