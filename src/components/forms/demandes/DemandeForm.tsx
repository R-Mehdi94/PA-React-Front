import { useState } from "react";
import {Demande, DemandeType } from "../../../types/demandeTypes";
import AutreDemandeForm from "./AutreDemandeForm";
import AideProjetDemandeForm from "./AideProjetDemandeForm";
import EvenementDemandeForm from "./EvenementDemandeForm";
import ParrainageDemandeForm from "./ParrainageDemandeForm";
import { sendEmailDemande, submitAideProjet, submitAutreDemande, submitDemande, submitEvenementDemande, submitParrainageDemande, verifVisiteur } from "../../../api/apiService";
import  './../../../css/demandeForm.css';

const DemandeForm: React.FC = () => {

  const [responseMessage, setResponseMessage] = useState<string | null>(null);


    const [demande, setDemande] = useState<Demande>({
      type: 'Projet',
      statut: 'En attente',
      emailVisiteur: ''
    });
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
      setResponseMessage(null);
      e.preventDefault();

      try {
        const response = await submitDemande(demande);
        specificData.demande = response.id;
        switch(demande.type){
          case 'Projet':
            await submitAideProjet(specificData);
            break;
          case 'Evénement':
            await submitEvenementDemande(specificData);
            break;
          case 'Parrainage':
            const verifVisiteurConst ={
              email: demande.emailVisiteur,
              numTel : specificData.numTel
            }
            const verif = await verifVisiteur(verifVisiteurConst);
            // @ts-ignore
            if (verif === "Visiteur non existant") {
              setResponseMessage('Adherent non trouvé, veuillez vérifier vos informations');
              return;
            }
            const parrainageDemande = {
              id: specificData.id,
              parrain: specificData.parrain,
              demandeId: specificData.demandeId,
              detailsParrainage: specificData.detailsParrainage,
              demande: specificData.demande
            }
            await submitParrainageDemande(parrainageDemande);
            break;
          case 'Autre':
            await submitAutreDemande(specificData);
            break;
        } 
        const demandeEmail={
          mail: demande.emailVisiteur,
          typeDemande: demande.type
        }
        await sendEmailDemande(demandeEmail)
        setResponseMessage('Demande soumise avec succès !');
        console.log('Response:', response);
      } catch (error) {
        setResponseMessage('Erreur lors de la soumission de la demande.');
        console.error('Error:', error);
      }
    };
  
    return (
      <div className={"container"}>
        <form onSubmit={handleSubmit}>
          <div className={'form-group'}>
            <label>
              Type de demande:
              {demande.type === 'Parrainage' && <h3>Demande reservé au adherent</h3>}

              <select name="type" value={demande.type} onChange={handleTypeChange}>
                <option value="Projet">Projet</option>
                <option value="Evénement">Evénement</option>
                <option value="Parrainage">Parrainage</option>
                <option value="Autre">Autre</option>
              </select>
            </label>
          </div>
          <div className={'form-group'}>
            <label>
              Email:
              <input type="email" name="emailVisiteur" value={demande.emailVisiteur} onChange={handleInputChange} required placeholder="Rentrer votre email" />
            </label>
          </div>
    
          {demande.type === 'Autre' && <AutreDemandeForm onChange={handleSpecificDataChange} />}
          {demande.type === 'Evénement' && <EvenementDemandeForm onChange={handleSpecificDataChange} />}
          {demande.type === 'Projet' && <AideProjetDemandeForm onChange={handleSpecificDataChange} />}
          {demande.type === 'Parrainage' && <ParrainageDemandeForm onChange={handleSpecificDataChange} />}
    
          <button type="submit">Soumettre</button>
        </form>
        {responseMessage && <p className={'response-message'}>{responseMessage}</p>}
      </div>
    );
  };
  
  export default DemandeForm;
