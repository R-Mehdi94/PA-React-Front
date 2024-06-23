import React from 'react';
import { EvenementDemande } from '../../../types/demandeTypes';

const EvenementDemandeForm: React.FC<{ onChange: (data: EvenementDemande) => void }> = ({ onChange }) => {
  const [data, setData] = React.useState<EvenementDemande>({
    titre: '',
    date: '',
    description: '',
    lieu: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    onChange({ ...data, [name]: value });
  };

  return (
    <>
      <label>
        Titre:
        <input type="text" name="titre" value={data.titre} onChange={handleInputChange} required />
      </label>
      <label>
        Date:
        <input type="datetime-local" name="date" value={data.date} onChange={handleInputChange} required />
      </label>
      <label>
        Description:
        <textarea name="description" value={data.description} onChange={handleInputChange} required />
      </label>
      <label>
        Lieu:
        <input type="text" name="lieu" value={data.lieu} onChange={handleInputChange} required />
      </label>
    </>
  );
};

export default EvenementDemandeForm;
