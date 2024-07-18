import React, { useEffect, useState } from 'react';
import { createInscription, Evenement, getEvenemnts, removeInscription, sendEmailDesinscription, sendEmailInscription, verifEmail, verifVisiteur } from '../api/apiService';
import '../css/eventList.css';

const EventList: React.FC = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [unsubscribeEmail, setUnsubscribeEmail] = useState<string>('');
  const [unsubscribePhone, setUnsubscribePhone] = useState<string>('');
  const [selectedUnsubscribeEventId, setSelectedUnsubscribeEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await getEvenemnts();
        if (response && response.Evenements) {
          setEvenements(response.Evenements);
        } else {
          setError('Error fetching events');
        }
      } catch (err) {
        setError('Error fetching events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvenements();
  }, []);

  const handleSignUpClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setSelectedUnsubscribeEventId(null); // Clear unsubscribe selection
    setConfirmationMessage(null);
    setError(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setError(null);
    setConfirmationMessage(null);
    e.preventDefault();

    const estReserve = evenements.find(e => e.id === selectedEventId)?.estReserve as boolean
    if (estReserve) {
      const verifVisiteurConst = {
        email: email,
        numTel: phone,
      };
      try {
        const verif = await verifVisiteur(verifVisiteurConst);
        // @ts-ignore
        if (verif === "Visiteur non existant") {
          setIsLoading(false);
          setError('Adherent non trouvé, veuillez vérifier vos informations');
          return;
        }

      } catch (error) {
        console.error('Error verifying visitor', error);
        throw error;
      }
    }

    const inscription = {
      emailVisiteur: email,
      evenement: selectedEventId as number,
    };
    try {
      const verif = await verifEmail({ emailVisiteur: email, evenement: selectedEventId as number });
      // @ts-ignore
      if (verif.response === "Email inscrit") {
        setIsLoading(false);
        setError('Vous êtes déjà inscrit à cet événement.');
        return;
      }
      await createInscription(inscription);
      const emailInscription = {
        mail: email,
        evenement: evenements.find(e => e.id === selectedEventId)?.nom as string,
        date: evenements.find(e => e.id === selectedEventId)?.date as Date,
        lieu: evenements.find(e => e.id === selectedEventId)?.lieu as string,
      };
      await sendEmailInscription(emailInscription);
      const response = await getEvenemnts();
      if (response && response.Evenements) {
        setEvenements(response.Evenements);
      } else {
        setIsLoading(false);
        setError('Error fetching events');
      }
      setIsLoading(false);
      setConfirmationMessage('Votre inscription a été prise en compte.');
    } catch (err) {
      console.error('Error creating inscription', err);
      setIsLoading(false);
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }

    setEmail('');
    setPhone('');
    setSelectedEventId(null);
  };

  const handleUnsubscribeClick = (eventId: number) => {
    setSelectedUnsubscribeEventId(eventId);
    setSelectedEventId(null); // Clear sign-up selection
    setConfirmationMessage(null);
    setError(null);
  };

  const handleUnsubscribeEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnsubscribeEmail(e.target.value);
  };

  const handleUnsubscribePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnsubscribePhone(e.target.value);
  };

  const handleUnsubscribeFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    setConfirmationMessage(null)
    setIsLoading(true);
    e.preventDefault();

    const evenement = evenements.find(e => e.id === selectedUnsubscribeEventId)?.estReserve as boolean;

    if (evenement) {
      const verifVisiteurConst = {
        email: unsubscribeEmail,
        numTel: unsubscribePhone,
      };
      try {
        const verif = await verifVisiteur(verifVisiteurConst);
        // @ts-ignore
        if (verif === "Visiteur non existant") {
          setIsLoading(false);
          setError('Adherent non trouvé, veuillez vérifier vos informations');
          return;
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error verifying visitor', error);
        throw error;
      }
    }

    try {
      const verif = await verifEmail({ emailVisiteur: unsubscribeEmail, evenement: selectedUnsubscribeEventId as number });
      // @ts-ignore
      if (verif.response === "Email non inscrit") {
        setIsLoading(false);
        setError('Inscription non trouvé, veuillez vérifier vos informations');
        return;
      }

      const verifRemove = await removeInscription({ emailVisiteur: unsubscribeEmail, evenement: selectedUnsubscribeEventId as number });

      if (!verifRemove) {
        setIsLoading(false);
        setError('Erreur lors de la suppression de l\'inscription, veuillez réessayer');
        return;
      }
      const response = await getEvenemnts();
      if (response && response.Evenements) {
        setEvenements(response.Evenements);
      } else {
        setIsLoading(false);
        setError('Error fetching events');
      }

      sendEmailDesinscription({ mail: unsubscribeEmail, evenement: evenements.find(e => e.id === selectedUnsubscribeEventId)?.nom as string });
      setIsLoading(false);
      setConfirmationMessage('Votre désinscription a été prise en compte.');

    } catch (err) {
      console.error('Error removing inscription', err);
      setIsLoading(false);
      setError('Une erreur est survenue lors de la désinscription. Veuillez réessayer.');
    }

    setUnsubscribeEmail('');
    setUnsubscribePhone('');
    setSelectedUnsubscribeEventId(null);
  };

  if (isLoading) {
    
    return <center>
          <div className="loader">
            <div className="square-1 square"></div>
            <div className="square-2 square"></div>
          </div>
      </center>
  }

  return (
    <div className="event-list">
      <h1>Liste des Événements</h1>
      {error && <div className="error-message">{error}</div>}
      {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
      <ul>
        {evenements.map((evenement) => (
          <li key={evenement.id} className="event-card">
            <h2>{evenement.nom}</h2>
            <p>Date : {new Date(evenement.date).toLocaleDateString()}</p>
            <p>Lieu : {evenement.lieu}</p>
            <p>{evenement.description}</p>
            <p>Places disponibles : {evenement.nbPlace}</p>
            <p>Réservé au membre adherent : {evenement.estReserve ? 'Oui' : 'Non'}</p>
            {evenement.nbPlace === 0 ? (
              <button className="disabled-button">Événement complet</button>
            ) : (
              <>
                <button className="subscribe-button" onClick={() => handleSignUpClick(evenement.id)}>Inscription</button>
                <button className="unsubscribe-button" onClick={() => handleUnsubscribeClick(evenement.id)}>Désinscription</button>
              </>
            )}
            {selectedEventId === evenement.id && (
              <form onSubmit={handleFormSubmit} className="signup-form">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Entrez votre email"
                  required
                />
                {evenement.estReserve && (
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Entrez votre numéro de téléphone"
                    required
                  />
                )}
                <button type="submit" className="submit-button">Valider</button>
              </form>
            )}
            {selectedUnsubscribeEventId === evenement.id && (
              <form onSubmit={handleUnsubscribeFormSubmit} className="unsubscribe-form">
                <input
                  type="email"
                  value={unsubscribeEmail}
                  onChange={handleUnsubscribeEmailChange}
                  placeholder="Entrez votre email"
                  required
                />
                {evenement.estReserve && (
                  <input
                    type="tel"
                    value={unsubscribePhone}
                    onChange={handleUnsubscribePhoneChange}
                    placeholder="Entrez votre numéro de téléphone"
                    required
                  />
                )}
                <button type="submit" className="submit-button">Valider</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
