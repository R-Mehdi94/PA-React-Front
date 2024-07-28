import React, { useEffect, useState } from 'react';
import { ParrainageDemande2 } from '../../../types/demandeTypes';
import { User, getUsers } from '../../../api/apiService';

interface Props {
  onChange: (data: ParrainageDemande2) => void;
}

const ParrainageDemandeFormAdherent: React.FC<Props> = ({ onChange }) => {
  const [data, setData] = React.useState<ParrainageDemande2>({
    parrain: 0,
    detailsParrainage: '',
    demande: 0  
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const gUsers = await getUsers();
        setUsers(gUsers.Users);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
    onChange(newData);
  };

  return (
    
    <>
  
      <label>
        Parrain:
        <select name="parrain" value={data.parrain} onChange={handleInputChange} required>
          <option value="">Sélectionner un parrain</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nom} {user.prenom}
            </option>
          ))}
        </select>
      </label>
      <label>
        Détails du parrainage:
        <textarea name="detailsParrainage" value={data.detailsParrainage} onChange={handleInputChange} required />
      </label>
    </>
  );
  
};

export default ParrainageDemandeFormAdherent;