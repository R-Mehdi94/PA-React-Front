import axios from 'axios';

export interface User {
    numTel: string;
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    age?: number;
    phone?: string;
    adress? : string;
    dateInscription? : Date ;
    estBenevole? : boolean;
    parrainId? : number;
  }




const api = axios.create({
  baseURL: 'http://localhost:3006/', // Remplacez par l'URL de votre API
});

export const getUsers = async () : Promise<User[]> => {
    try {
        const response = await api.get('/users', { mode: 'no-cors' } as any ); // Ajoutez l'option mode: 'no-cors'
        return response.data;
      } catch (error) {
        console.error('Error fetching data', error);
        throw error;
      }
};

export interface DocumentLink {
  sasUrl: string;

}
export const getDocumentlien = async (blobName :string , token: string,iduser:number): Promise<DocumentLink> => {
  try {
    const response = await api.post(/generate-sas-url/${iduser}, 
    { blobName , token }, 
    { headers: { Authorization: Bearer ${token} } })
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}