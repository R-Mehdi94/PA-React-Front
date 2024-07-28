import React, { useEffect, useState } from "react";
import ProfilNavigation from "../../pages/ProfilNavigation";
import { getDemandes } from "../../api/apiService";
import "../../css/profil.css"; // Assurez-vous que le fichier CSS est importé

const MyRequests: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [demandes, setDemandes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await getDemandes(storedUser.adherent.id);
        if (response && response.Demandes) {
          // Tri des demandes par date de demande, du plus récent au plus ancien
          const sortedDemandes = response.Demandes.sort((a: any, b: any) => new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime());
          setDemandes(sortedDemandes);
        } else {
          console.log('Error fetching requests');
        }
      } catch (err) {
        console.log('Error fetching requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandes();
  }, [storedUser.adherent.id]);

  const getStatusClass = (statut: string) => {
    switch (statut) {
      case 'Acceptée':
        return 'accepted';
      case 'En attente':
        return 'pending';
      case 'Refusée':
        return 'rejected';
      default:
        return '';
    }
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
        <h2>Mes demandes</h2>
        <div className="requests-list">
          {demandes.map((demande) => (
            <div key={demande.id} className={`request-item card ${getStatusClass(demande.statut)}`}>
              <h3>Type : {demande.type}</h3>
              <p>Date de demande : {new Date(demande.dateDemande).toLocaleDateString()}</p>
              <p>Statut : {demande.statut}</p>
              {demande.evenementDemandes.length > 0 && (
                <div>
                  <h4>Événement :</h4>
                  {demande.evenementDemandes.map((event: any) => (
                    <div key={event.id}>
                      <p>Titre : {event.titre}</p>
                      <p>Date : {new Date(event.date).toLocaleDateString()}</p>
                      <p>Description : {event.description}</p>
                      <p>Lieu : {event.lieu}</p>
                    </div>
                  ))}
                </div>
              )}
              {demande.aideProjetDemandes.length > 0 && (
                <div>
                  <h4>Projet :</h4>
                  {demande.aideProjetDemandes.map((project: any) => (
                    <div key={project.id}>
                      <p>Titre : {project.titre}</p>
                      <p>Description : {project.descriptionProjet}</p>
                      <p>Budget : {project.budget} €</p>
                      <p>Deadline : {new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
              {demande.parrainageDemandes.length > 0 && (
                <div>
                  <h4>Parrainage :</h4>
                  {demande.parrainageDemandes.map((sponsorship: any) => (
                    <div key={sponsorship.id}>
                      <p>Détails : {sponsorship.detailsParrainage}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
