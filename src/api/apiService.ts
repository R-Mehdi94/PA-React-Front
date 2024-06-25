import axios from 'axios';
import { AideProjetDemande, AutreDemande, Demande, EvenementDemande, ParrainageDemande } from '../types/demandeTypes';

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
  
  interface GetUsersResponse {
    Users: User[];
    totalCount: number;
  }

export interface Visiteur {
    email: string
    nom: string
    prenom: string
    age: number
    numTel: string
    adresse: string
    profession: string
    estBenevole: boolean
}

export enum TypeTransaction {
    Don = "Don",
    PaiementCotisations = "Cotisation",
    Inscription = "Inscription"
}

interface Transaction{
  emailVisiteur: string
  evenement?: number
  montant: number
  methodePaiement: string
  type: TypeTransaction
  dateTransaction?: Date
}

interface TransactionCree{
  transactionCréé:  Transaction,
  clientSecret:string
}


const api = axios.create({
  baseURL: 'http://localhost:3000/', // Remplacez par l'URL de votre API
});

export const getUsers = async (): Promise<GetUsersResponse> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const createVisiteur= async (visiteur:Visiteur): Promise<Visiteur> => {
  try {
      const response = await api.post('/visiteurs', visiteur);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const createTransaction = async (transaction:Transaction): Promise<TransactionCree> => {
  try {
      const response = await api.post('/transactions', transaction);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const submitDemande = async (demande: Demande): Promise<Demande> => {
  try {
      const response = await api.post('/demandes', demande);
      return response.data;
  } catch (error) {
      console.error('Error submitting demande', error);
      throw error;
  }
};

export const submitAutreDemande = async (autredemande: AutreDemande): Promise<AutreDemande> => {
  try {
      const response = await api.post('/autre-demandes', autredemande);
      return response.data;
  } catch (error) {
      console.error('Error submitting autredemande', error);
      throw error;
  }
};

export const submitAideProjet = async (aideProjetDemande: AideProjetDemande): Promise<AideProjetDemande> => {
  try {
      const response = await api.post('/aide-projet-demandes', aideProjetDemande);
      return response.data;
  } catch (error) {
      console.error('Error submitting aideProjetDemande', error);
      throw error;
  }
};

export const submitEvenementDemande = async (evenementDemande: EvenementDemande): Promise<EvenementDemande> => {
  try {
      const response = await api.post('/evenement-demandes', evenementDemande);
      return response.data;
  } catch (error) {
      console.error('Error submitting evenementDemande', error);
      throw error;
  }
};

export const submitParrainageDemande = async (parrainageDemande: ParrainageDemande): Promise<ParrainageDemande> => {
  try {
      const response = await api.post('/parrainage-demandes', parrainageDemande);
      return response.data;
  } catch (error) {
      console.error('Error submitting parrainageDemande', error);
      throw error;
  }
};