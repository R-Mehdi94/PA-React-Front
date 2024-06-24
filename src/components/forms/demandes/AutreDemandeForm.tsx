import React from "react";
import { AutreDemande } from "../../../types/demandeTypes";

interface Props {
  onChange: (data: AutreDemande) => void;
}

const AutreDemandeForm: React.FC<Props> = ({ onChange }) => {
  const [data, setData] = React.useState<AutreDemande>({ titre: '', description: '', demande: 0});
  
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