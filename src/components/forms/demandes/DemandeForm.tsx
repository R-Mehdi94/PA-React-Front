import { useState } from "react";
import { Demande, DemandeType } from "../../../types/demandeTypes";
import AutreDemandeForm from "./AutreDemandeForm";
import AideProjetDemandeForm from "./AideProjetDemandeForm";
import EvenementDemandeForm from "./EvenementDemandeForm";
import ParrainageDemandeForm from "./ParrainageDemandeForm";
import { createVisiteur, getVisiteurParMail, sendEmailDemande, submitAideProjet, submitAutreDemande, submitDemande, submitEvenementDemande, submitParrainageDemande, updateVisiteur, verifVisiteur } from "../../../api/apiService";
import './../../../css/demandeForm.css';

const DemandeForm: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialDemandeState: Demande = {
    type: 'Projet',
    statut: 'En attente',
    visiteur: 0,
    email: '',
    nom: '',
    prenom: '',
    age: 0,
    numTel: '',
    profession: '',
    dateDemande: new Date().toISOString()
  };

  const [demande, setDemande] = useState<Demande>(initialDemandeState);
  const [specificData, setSpecificData] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDemande({
      ...demande,
      [name]: value
    });
    setSpecificData({});
  };

  const handleSpecificDataChange = (data: any) => {
    setSpecificData(data);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDemande({
      ...demande,
      type: e.target.value as DemandeType
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    setResponseMessage(null);
    e.preventDefault();

    let visiteur;
    const verifVisiteurConst = {
      email: demande.email
    };

    try {
      // @ts-ignore
      const verif = await verifVisiteur(verifVisiteurConst);
      // @ts-ignore
      if (verif === "Visiteur non existant") {
        // @ts-ignore
        visiteur = await createVisiteur({ email: demande.email, nom: demande.nom, prenom: demande.prenom, age: demande.age, numTel: demande.numTel, profession: demande.profession, estBanie: false });
      } else {
        // @ts-ignore
        visiteur = await getVisiteurParMail(demande.email);
        // @ts-ignore
        if (visiteur.Visiteurs[0].isBanie) {
          setIsLoading(false);
          setResponseMessage('Vous êtes banni');
          return;
        }
        // @ts-ignore
        await updateVisiteur({ id: visiteur.data?.id ?? visiteur.Visiteurs[0].id, email: demande.email, nom: demande.nom, prenom: demande.prenom, age: demande.age, numTel: demande.numTel, profession: demande.profession });
      }
    } catch (error) {
      console.error('Error verifying visitor', error);
      setIsLoading(false);
      setResponseMessage('Erreur lors de la vérification du visiteur.');
      return;
    }

    try {
      const demande2 = {
        type: demande.type,
        dateDemande: demande.dateDemande,
        statut: demande.statut,
        // @ts-ignore
        visiteur: visiteur.data?.id ?? visiteur.Visiteurs[0].id
      }

      const response = await submitDemande(demande2);
      specificData.demande = response.id;

      switch (demande.type) {
        case 'Projet':
          await submitAideProjet(specificData);
          break;
        case 'Evénement':
          await submitEvenementDemande(specificData);
          break;
        case 'Parrainage':
          const parrainageDemande = {
            id: specificData.id,
            parrain: specificData.parrain,
            demandeId: specificData.demandeId,
            detailsParrainage: specificData.detailsParrainage,
            demande: specificData.demande
          };
          await submitParrainageDemande(parrainageDemande);
          break;
        case 'Autre':
          await submitAutreDemande(specificData);
          break;
      }

      const demandeEmail = {
        mail: demande.email,
        typeDemande: demande.type
      };
      //@ts-ignore
      await sendEmailDemande(demandeEmail);

      setIsLoading(false);
      setResponseMessage('Demande soumise avec succès !');
      console.log('Response:', response);

      // Réinitialiser le formulaire
      setDemande(initialDemandeState);
      setSpecificData({});
    } catch (error) {
      setIsLoading(false);
      setResponseMessage('Erreur lors de la soumission de la demande.');
      console.error('Error:', error);
    }
  }

  return (
    <div className="container">
      {isLoading &&
        <center>
          <br />
          <div className="loader">
            <div className="square-1 square"></div>
            <div className="square-2 square"></div>
          </div>
          <br />
          <br />
        </center>
      }
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Type de demande:
            {demande.type === 'Parrainage' && <h3>Demande réservée aux adhérents</h3>}
            <select name="type" value={demande.type} onChange={handleTypeChange}>
              <option value="Projet">Projet</option>
              <option value="Evénement">Evénement</option>
              <option value="Parrainage">Parrainage</option>
              <option value="Autre">Autre</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input type="email" name="email" value={demande.email} onChange={handleInputChange} required placeholder="Rentrer votre email" />
          </label>
        </div>
        <div className="form-group">
          <label>
            Nom:
            <input type="text" name="nom" value={demande.nom} onChange={handleInputChange} required placeholder="Rentrer votre nom" />
          </label>
        </div>
        <div className="form-group">
          <label>
            Prénom:
            <input type="text" name="prenom" value={demande.prenom} onChange={handleInputChange} required placeholder="Rentrer votre prénom" />
          </label>
        </div>
        <div className="form-group">
          <label>
            Âge:
            <input type="number" name="age" value={demande.age} onChange={handleInputChange} required placeholder="Rentrer votre âge" />
          </label>
        </div>
        <div className="form-group">
          <label>
            Numéro de téléphone:
            <input type="tel" name="numTel" value={demande.numTel} onChange={handleInputChange} required placeholder="Rentrer votre numéro de téléphone" />
          </label>
        </div>
        <div className="form-group">
          <label>
            Profession:
            <input type="text" name="profession" value={demande.profession} onChange={handleInputChange} required placeholder="Rentrer votre profession" />
          </label>
        </div>

        {demande.type === 'Autre' && <AutreDemandeForm onChange={handleSpecificDataChange} />}
        {demande.type === 'Evénement' && <EvenementDemandeForm onChange={handleSpecificDataChange} />}
        {demande.type === 'Projet' && <AideProjetDemandeForm onChange={handleSpecificDataChange} />}
        {demande.type === 'Parrainage' && <ParrainageDemandeForm onChange={handleSpecificDataChange} />}

        <button type="submit">Soumettre</button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default DemandeForm;
