import { useState } from "react";
import { AutreDemande, AideProjetDemande, Demande, DemandeType, EvenementDemande, ParrainageDemande } from "../../../types/demandeTypes";
import AutreDemandeForm from "./AutreDemandeForm";
import AideProjetDemandeForm from "./AideProjetDemandeForm";
import EvenementDemandeForm from "./EvenementDemandeForm";
import ParrainageDemandeForm from "./ParrainageDemandeForm";

const DemandeForm: React.FC = () => {
    const [demande, setDemande] = useState<Demande>({
      type: 'Projet',
      statut: 'En attente',
      emailVisiteur: ''
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setDemande({
        ...demande,
        [name]: value
      });
    };
  
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDemande({
        ...demande,
        type: e.target.value as DemandeType
      });
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      console.log(demande);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Type de demande:
          <select name="type" value={demande.type} onChange={handleTypeChange}>
            <option value="Projet">Projet</option>
            <option value="Evénement">Evénement</option>
            <option value="Parrainage">Parrainage</option>
            <option value="Autre">Autre</option>
          </select>
        </label>
        <label>
          Email:
          <input type="email" name="emailVisiteur" value={demande.emailVisiteur} onChange={handleInputChange} required />
        </label>
  
        {demande.type === 'Autre' && <AutreDemandeForm onChange={function (data: AutreDemande): void {
                throw new Error("Function not implemented.");
            } } />}
        {demande.type === 'Evénement' && <EvenementDemandeForm onChange={function (data: EvenementDemande): void {
                throw new Error("Function not implemented.");
            } } />}
        {demande.type === 'Projet' && <AideProjetDemandeForm onChange={function (data: AideProjetDemande): void {
                throw new Error("Function not implemented.");
            } } />}
        {demande.type === 'Parrainage' && <ParrainageDemandeForm onChange={function (data: ParrainageDemande): void {
                throw new Error("Function not implemented.");
            } } />}
  
        <button type="submit">Soumettre</button>
      </form>
    );
  };
  
  export default DemandeForm;