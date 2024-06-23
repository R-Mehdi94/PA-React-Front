import React from 'react';
import { ParrainageDemande } from '../../../types/demandeTypes';

const ParrainageDemandeForm: React.FC<{ onChange: (data: ParrainageDemande) => void }> = ({ onChange }) => {
  const [data, setData] = React.useState<ParrainageDemande>({
    parrainId: 0,
    detailsParrainage: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    onChange({ ...data, [name]: value });
  };

  return (
    <>
      <label>
        Parrain ID:
        <input type="number" name="parrainId" value={data.parrainId} onChange={handleInputChange} required />
      </label>
      <label>
        Détails du parrainage:
        <textarea name="detailsParrainage" value={data.detailsParrainage} onChange={handleInputChange} required />
      </label>
    </>
  );
};

export default ParrainageDemandeForm;
