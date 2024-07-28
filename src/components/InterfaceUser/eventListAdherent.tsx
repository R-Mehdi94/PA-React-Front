import React, { useEffect, useState } from 'react';
import { createInscriptionAdherent, Evenement, getEvenemnts, sendEmailInscription, verifEmailAdherent } from '../../api/apiService';
import '../../css/eventList.css';

const EventList: React.FC = () => {
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);


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
    setConfirmationMessage(null);
    setError(null);
  };


  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setError(null);
    setConfirmationMessage(null);
    e.preventDefault();



    const inscription = {
    adherent: storedUser.adherent.id,
      evenement: selectedEventId as number,
    };
    try {
      const verif = await verifEmailAdherent({ id: storedUser.adherent.id, evenement: selectedEventId as number });
      // @ts-ignore
      if (verif.response === "Email inscrit") {
        setIsLoading(false);
        setError('Vous êtes déjà inscrit à cet événement.');
        return;
      }
      await createInscriptionAdherent(inscription);
      const emailInscription = {
        mail: storedUser.adherent.email,
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

    setSelectedEventId(null);
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
              <form onSubmit={handleFormSubmit} className="signup-form">
                <button type="submit" className="subscribe-button" onClick={() => handleSignUpClick(evenement.id)}>Inscription</button>
              </form>              
              </>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
