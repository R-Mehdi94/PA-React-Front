import React, { useState } from "react";
import ProfilNavigation from "../../pages/ProfilNavigation";
import { changePassword, updateAdherent, deleteAccount, logout } from "../../api/apiService"; // Ajoutez votre API de suppression de compte
import Modal from 'react-modal'; // Assurez-vous que react-modal est installé
import "../../css/profil.css"; // Assurez-vous que le fichier CSS est importé
import { useNavigate } from "react-router-dom";

const ProfileDetails: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(storedUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

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

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    setIsLoading(true);
    const changePasswordResponse = await changePassword(user.adherent.id, oldPassword, newPassword, storedUser.token);
    if (changePasswordResponse === null) {
      alert("Changement de mot de passe échoué, veuillez vérifier votre saisie");
      setIsLoading(false);
      return;
    }
    alert("Mot de passe changé avec succès");
    setShowChangePassword(false);
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setShowDeleteConfirmation(false);
    const logoutResponse = logout({ id: user.adherent.id, token: user.token });
    if (!logoutResponse) {
      alert("Logout failed");
      return;
    }
    const deleteAccountResponse = await deleteAccount(user.adherent.id, storedUser.token);
    if (deleteAccountResponse === null) {
      alert("La suppression du compte a échoué, veuillez réessayer");
      setIsLoading(false);
      return;
    }
    alert("Compte supprimé avec succès");
    localStorage.removeItem("user");
    setIsLoading(false);
    navigate("/");
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
        <form className="profile-form">
          <div className="form-group">
            <label>Nom: </label>
            <input
              name="nom"
              type="text"
              value={user.adherent.nom || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Prénom: </label>
            <input
              name="prenom"
              type="text"
              value={user.adherent.prenom || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Email: </label>
            <input
              name="email"
              type="email"
              value={user.adherent.email || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Âge: </label>
            <input
              name="age"
              type="number"
              value={user.adherent.age || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Numéro de téléphone: </label>
            <input
              name="numTel"
              type="text"
              value={user.adherent.numTel || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Adresse: </label>
            <input
              name="adresse"
              type="text"
              value={user.adherent.adresse || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Profession: </label>
            <input
              name="profession"
              type="text"
              value={user.adherent.profession || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="button" onClick={handleSave} className="btn btn-save">Sauvegarder</button>
        </form>
        
        <button
          type="button"
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="btn btn-change-password">
          Changer de mot de passe
        </button>
        {showChangePassword && (
          <form className="change-password-form">
            <div className="form-group">
              <label>Ancien mot de passe: </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe: </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Confirmer le nouveau mot de passe: </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="button" onClick={handleChangePassword} className="btn btn-save">Changer le mot de passe</button>
          </form>
        )}
        <button
          type="button"
          onClick={() => setShowDeleteConfirmation(true)}
          className="btn btn-delete-account">
          Supprimer mon compte
        </button>
        <Modal
          isOpen={showDeleteConfirmation}
          onRequestClose={() => setShowDeleteConfirmation(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Confirmation de suppression</h2>
          <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
          <button type="button" onClick={handleDeleteAccount} className="btn btn-save">Oui, supprimer</button>
          <button type="button" onClick={() => setShowDeleteConfirmation(false)} className="btn btn-cancel">Annuler</button>
        </Modal>
      </div>
    </div>
  );
};

export default ProfileDetails;
