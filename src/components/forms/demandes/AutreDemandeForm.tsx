import React from "react";
import { AutreDemande } from "../../../types/demandeTypes";

const AutreDemandeForm: React.FC<{ onChange: (data: AutreDemande) => void }> = ({ onChange }) => {
    const [data, setData] = React.useState<AutreDemande>({ titre: '', description: '' });
  
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
          Description:
          <textarea name="description" value={data.description} onChange={handleInputChange} required />
        </label>
      </>
    );
  };
  
  export default AutreDemandeForm;