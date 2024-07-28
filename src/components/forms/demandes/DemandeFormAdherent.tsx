import { useState } from "react";
import {Demande, DemandeType } from "../../../types/demandeTypes";
import AutreDemandeForm from "./AutreDemandeForm";
import AideProjetDemandeForm from "./AideProjetDemandeForm";
import EvenementDemandeForm from "./EvenementDemandeForm";
import { sendEmailDemande, submitAideProjet, submitAutreDemande, submitDemande, submitEvenementDemande, submitParrainageDemande} from "../../../api/apiService";
import  './../../../css/demandeForm.css';
import ParrainageDemandeFormAdherent from "./ParrainageDemandeFormAdherent";

const DemandeFormAdherent: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


    const [demande, setDemande] = useState<Demande>({
      type: 'Projet',
      statut: 'En attente',
      adherent: storedUser.adherent.id,
      dateDemande: new Date().toISOString()
    });
    const [specificData, setSpecificData] = useState<any>({});

  


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
          mail: storedUser.adherent.email,
          typeDemande: demande.type
        }
        await sendEmailDemande(demandeEmail)
        setIsLoading(false);
        setResponseMessage('Demande soumise avec succès !');
        console.log('Response:', response);
      } catch (error) {
        setIsLoading(false);
        setResponseMessage('Erreur lors de la soumission de la demande.');
        console.error('Error:', error);
      }
    };
  
    return (
      
      <div className={"container"}>
        {isLoading && 
          <center>
              <br />
              <div className="loader">
                  <div className="square-1 square"></div>
                  <div className="square-2 square"></div>
              </div>
              <br />
              <br />
          </center>}
        <form onSubmit={handleSubmit}>
          <div className={'form-group'}>
            <label>
              Type de demande:

              <br />
              <br />
              <select name="type" value={demande.type} onChange={handleTypeChange}>
                <option value="Projet">Projet</option>
                <option value="Evénement">Evénement</option>
                <option value="Parrainage">Parrainage</option>
                <option value="Autre">Autre</option>
              </select>
            </label>
          </div>

    
          {demande.type === 'Autre' && <AutreDemandeForm onChange={handleSpecificDataChange} />}
          {demande.type === 'Evénement' && <EvenementDemandeForm onChange={handleSpecificDataChange} />}
          {demande.type === 'Projet' && <AideProjetDemandeForm onChange={handleSpecificDataChange} />}
          {demande.type === 'Parrainage' && <ParrainageDemandeFormAdherent onChange={handleSpecificDataChange} />}
    
          <button type="submit">Soumettre</button>
        </form>
        {responseMessage && <p className={'response-message'}>{responseMessage}</p>}
      </div>
    );
  };
  
  export default DemandeFormAdherent;
