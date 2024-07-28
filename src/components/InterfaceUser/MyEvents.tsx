import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import ProfilNavigation from "../../pages/ProfilNavigation";
import { Evenement, getEvenemntsUser, removeInscriptionAdherent } from "../../api/apiService";
import "../../css/profil.css"; // Assurez-vous que le fichier CSS est importé

Modal.setAppElement('#root'); // Assurez-vous que cet élément existe dans votre index.html

const MyEvents: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventToUnsubscribe, setEventToUnsubscribe] = useState<Evenement | null>(null);

  useEffect(() => {
    console.log(storedUser)
    const fetchEvenements = async () => {
      try {
        const response = await getEvenemntsUser(storedUser.adherent.id);
        if (response && response.Inscriptions) {
          const events = response.Inscriptions.map((inscription: any) => inscription.evenement);
          setEvenements(events);
        } else {
          console.log('Error fetching events');
        }
      } catch (err) {
        console.log('Error fetching events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvenements();
  }, []);

  const openModal = (event: Evenement) => {
    setEventToUnsubscribe(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventToUnsubscribe(null);
  };

  const handleUnsubscribe = async () => {
    closeModal();
    setIsLoading(true);
    if (eventToUnsubscribe) {
      const verifRemove = await removeInscriptionAdherent({ adherent: storedUser.adherent.id, evenement: eventToUnsubscribe.id });
      console.log(verifRemove);
      if (!verifRemove) {
        setIsLoading(false);
        console.log('Erreur lors de la suppression de l\'inscription, veuillez réessayer');
        return;
      }      
      console.log(`Désinscription de l'événement avec l'ID: ${eventToUnsubscribe.id}`);
      const response = await getEvenemntsUser(storedUser.adherent.id);
      const events = response.Inscriptions.map((inscription: any) => inscription.evenement);
      setEvenements(events);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
      <br/>
      <br/>
      <center>
        <div className="loader">
          <div className="square-1 square"></div>
          <div className="square-2 square"></div>
        </div>
      </center>
      <ProfilNavigation />
      </>

    );
  }

  return (
    <div className="profile-container">
      <ProfilNavigation />
      <div className="profile-details">
        <h2>Mes événements</h2>
        <div className="events-list">
          {evenements.map((event) => (
            <div key={event.id} className="event-item card">
              <h3>{event.nom}</h3>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Description: {event.description}</p>
              <p>Lieu: {event.lieu}</p>
              <p>Réservé: {event.estReserve ? "Oui" : "Non"}</p>
              <p>Nombre de Places: {event.nbPlace}</p>
              <button onClick={() => openModal(event)}>Désinscription</button>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Désinscription"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirmer la désinscription</h2>
        <p>Êtes-vous sûr de vouloir vous désinscrire de cet événement ?</p>
        <button onClick={handleUnsubscribe}>Oui</button>
        <button onClick={closeModal}>Non</button>
      </Modal>
    </div>
  );
};

export default MyEvents;
