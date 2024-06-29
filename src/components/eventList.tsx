import React, { useEffect, useState } from 'react';
import { createInscription, Evenement, getEvenemnts, sendEmailInscription } from '../api/apiService';
import '../css/eventList.css'; // Assurez-vous de créer et d'importer ce fichier CSS

const EventList: React.FC = () => {
    const [evenements, setEvenements] = useState<Evenement[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [email, setEmail] = useState<string>('');
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
      setConfirmationMessage(null); // Reset the confirmation message when a new sign up is initiated
    };
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };
  
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const inscription = {
        emailVisiteur: email,
        evenement: selectedEventId as number,
      };
      try {
        await createInscription(inscription);
        const emailInscription = {
          mail: email,
          evenement: evenements.find(e => e.id === selectedEventId)?.nom as string,
          date: evenements.find(e => e.id === selectedEventId)?.date as Date,
          lieu: evenements.find(e => e.id === selectedEventId)?.lieu as string,
        };
        await sendEmailInscription(emailInscription);
        setConfirmationMessage('Votre inscription a été prise en compte.');
        setTimeout(() => {
          setConfirmationMessage(null);
          window.location.reload(); // Refresh the page after a short delay
        }, 3000); // Display the confirmation message for 3 seconds
      } catch (err) {
        console.error('Error creating inscription', err);
        throw err;
      }
  
      setEmail('');
      setSelectedEventId(null);
    };
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    return (
      <div className="event-list">
        <h1>Liste des Événements</h1>
        {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
        <ul>
          {evenements.map((evenement) => (
            <li key={evenement.id} className="event-card">
              <h2>{evenement.nom}</h2>
              <p>Date: {new Date(evenement.date).toLocaleDateString()}</p>
              <p>Lieu: {evenement.lieu}</p>
              <p>{evenement.description}</p>
              <p>Places disponibles: {evenement.nbPlace}</p>
              <p>Réservation: {evenement.estReserve ? 'Oui' : 'Non'}</p>
              {evenement.nbPlace === 0 ? (
                <button className="disabled-button">Événement complet</button>
              ) : (
                <>
                  {evenement.estReserve ? (
                    <button className="disabled-button">Événement réservé aux adhérents</button>
                  ) : (
                    <button className="signup-button" onClick={() => handleSignUpClick(evenement.id)}>Inscription</button>
                  )}
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
