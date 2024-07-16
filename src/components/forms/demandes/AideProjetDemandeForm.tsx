import React from 'react';
import { AideProjetDemande } from '../../../types/demandeTypes';



interface Props {
  onChange: (data: AideProjetDemande) => void;
}

const AideProjetDemandeForm: React.FC<Props> = ({ onChange }) => {
  

  
  
  const [data, setData] = React.useState<AideProjetDemande>({
    titre: '',
    descriptionProjet: '',
    budget: 0,
    deadline: '',
    demande: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
    onChange(newData);
  };

  return (
    <>
      <label>
        Titre:
        <input type="text" name="titre" value={data.titre} onChange={handleInputChange} required placeholder="Rentrer le titre"/>
      </label>
      <label>
        Description du projet:
        <textarea name="descriptionProjet" value={data.descriptionProjet} onChange={handleInputChange} required placeholder="Description du projet"/>
      </label>
      <label>
        Budget:
        <input type="number" name="budget" value={data.budget} onChange={handleInputChange} />
      </label>
      <label>
        Deadline:
        <input type="datetime-local" name="deadline" value={data.deadline} onChange={handleInputChange} />
      </label>
    </>
  );
};

export default AideProjetDemandeForm;
