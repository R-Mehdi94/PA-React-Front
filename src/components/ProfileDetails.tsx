import React, { useState } from "react";
import ProfilNavigation from "../pages/ProfilNavigation";
import { updateAdherent } from "../api/apiService";
import "../css/profil.css"; // Assurez-vous que le fichier CSS est importé

const ProfileDetails: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(storedUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async () => {
    setIsLoading(true);

    const updateAdherentResponse = await updateAdherent(user);

    if (updateAdherentResponse === null) {
      alert("Modification échouée, veuillez vérifier votre saisie");
      setIsLoading(false);
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({
      ...prevUser,
      adherent: {
        ...prevUser.adherent,
        [name]: value,
      },
    }));
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
        <h2>Profil</h2>
        <form>
          <div>
            <label>Nom: </label>
            <input
              name="nom"
              type="text"
              value={user.adherent.nom || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Prénom: </label>
            <input
              name="prenom"
              type="text"
              value={user.adherent.prenom || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              name="email"
              type="email"
              value={user.adherent.email || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Âge: </label>
            <input
              name="age"
              type="number"
              value={user.adherent.age || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Numéro de téléphone: </label>
            <input
              name="numTel"
              type="text"
              value={user.adherent.numTel || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Adresse: </label>
            <input
              name="adresse"
              type="text"
              value={user.adherent.adresse || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Profession: </label>
            <input
              name="profession"
              type="text"
              value={user.adherent.profession || ""}
              onChange={handleChange}
            />
          </div>
          <button type="button" onClick={handleSave}>Sauvegarder</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileDetails;
