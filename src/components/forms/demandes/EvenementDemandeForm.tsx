import React from 'react';
import { EvenementDemande } from '../../../types/demandeTypes';

interface Props {
  onChange: (data: EvenementDemande) => void;
}

const EvenementDemandeForm: React.FC<Props> = ({ onChange }) => {
  const [data, setData] = React.useState<EvenementDemande>({
    titre: '',
    date: '',
    description: '',
    lieu: '',
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
        Date:
        <input type="datetime-local" name="date" value={data.date} onChange={handleInputChange} required />
      </label>
      <label>
        Description:
        <textarea name="description" value={data.description} onChange={handleInputChange} required placeholder="Description de l'évenement"/>
      </label>
      <label>
        Lieu:
        <input type="text" name="lieu" value={data.lieu} onChange={handleInputChange} required placeholder="Lieu de l'événement"/>
      </label>
    </>
  );
};

export default EvenementDemandeForm;
