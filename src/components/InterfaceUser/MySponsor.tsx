import React from "react";
import ProfilNavigation from "../../pages/ProfilNavigation";

const MySponsor: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const sponsor = storedUser.adherent?.parrain;

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <div className="profile-container">
      <ProfilNavigation />
      <div className="profile-details">
        <h2>Mon parrain</h2>
        {sponsor ? (
          <div className="sponsor-details card">
            <h3>Nom : {sponsor.nom}</h3>
            <p>Prénom : {sponsor.prenom}</p>
            <p>Email : {sponsor.email}</p>
            <p>Téléphone : {sponsor.numTel}</p>
            <p>Adresse : {sponsor.adresse}</p>
            <p>Profession : {sponsor.profession}</p>
            <button onClick={() => handleEmailClick(sponsor.email)} className="email-button">Envoyer un email</button>
          </div>
        ) : (
          <p className="no-sponsor-message">Vous n'avez pas de parrain.</p>
        )}
      </div>
    </div>
  );
};

export default MySponsor;
