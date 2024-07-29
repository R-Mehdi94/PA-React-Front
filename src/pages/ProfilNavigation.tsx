// src/pages/Profil.tsx

import {useNavigate } from "react-router-dom";
import "../css/ProfilNavigation.css";


const ProfilNavigation: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="profil-container">
      <div className="sidebar">
        <ul>
          <li><button onClick={() => handleNavigation("/profil/details")}>Profil</button></li>
          <li><button onClick={() => handleNavigation("/profil/events")}>Mes événements</button></li>
          <li><button onClick={() => handleNavigation("/profil/donations")}>Mes dons</button></li>
          <li><button onClick={() => handleNavigation("/profil/subscriptions")}>Mes cotisations</button></li>
          <li><button onClick={() => handleNavigation("/profil/sponsor")}>Mon parrain</button></li>
          <li><button onClick={() => handleNavigation("/profil/requests")}>Mes demandes</button></li>
          <li><button onClick={() => handleNavigation("/profil/projects")}>Mes Projets</button></li>


        </ul>
      </div>
      <div className="content">

      </div>
    </div>
  );
};

export default ProfilNavigation;
