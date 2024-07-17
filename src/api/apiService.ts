import axios from 'axios';
import { AideProjetDemande, AutreDemande, Demande, DemandeType, EvenementDemande, ParrainageDemande } from '../types/demandeTypes';

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
  
 export interface GetUsersResponse {
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

export interface Transaction{
  emailVisiteur: string
  evenement?: number
  montant: number
  methodePaiement: string
  type: TypeTransaction
  dateTransaction?: Date
}

export interface TransactionCree{
  transactionCréé:  Transaction,
  clientSecret:string
}

export interface EmailAdherer{
  mail:string,
  prenom:string
}

export interface EmailDon{
  mail:string,
  montant:number
}

export interface EmailDemande{
  mail:string,
  typeDemande:DemandeType
}

export interface Evenement{
  id:number
  nom: string
  date: Date
  description: string
  lieu: string
  estReserve: boolean
  nbPlace: number
}

export interface getEvenemntsResponse{
  Evenements: Evenement[]
  totalCount: number
}

export interface Inscription{
  emailVisiteur:string,
  evenement:number
}

export interface EmailInscription{
  mail:string,
  evenement:string,
  date:Date,
  lieu:string
}

export interface VerifEmail {
  emailVisiteur: string
  evenement: number
}

export interface VerifVisiteur {
  email: string
  numTel: string
}
export interface DeleteInscriptionValidationRequest {
  emailVisiteur: string
  evenement: number
}
const api = axios.create({
  //baseURL: 'https://pa-api-0tcm.onrender.com/', 
  baseURL:'http://localhost:3000/'
});

const n8n = axios.create({
  baseURL: 'https://mehdikit.app.n8n.cloud/webhook/', 
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

export const getEvenemnts = async (): Promise<getEvenemntsResponse> => {
  try {
    const response = await api.get('/evenements');
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const createInscription= async (inscription:Inscription): Promise<Inscription> => {
  try {
      const response = await api.post('/inscriptions', inscription);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const createVisiteur= async (visiteur:Visiteur) => {
  try {
      const response = await api.post('/visiteurs', visiteur);
      return response;
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

export const sendEmailDon = async (emailDon: EmailDon): Promise<EmailDon> => {
  try {
      const response = await n8n.post('/96fba311-2a74-4e52-845d-c4c25f8983b0', emailDon);
      return response.data;
  } catch (error) {
      console.error('Error submitting email donation', error);
      throw error;
  }
};

export const sendEmailAdherer = async (emailAdherer: EmailAdherer): Promise<EmailAdherer> => {
  try {
      const response = await n8n.post('/a4084024-bdac-4826-abf0-aac5e3bdc602', emailAdherer);
      return response.data;
  } catch (error) {
      console.error('Error submitting email adherer', error);
      throw error;
  }
};

export const sendEmailDemande = async (emailDemande: EmailDemande): Promise<EmailDemande> => {
  try {
      const response = await n8n.post('/73933007-8e4d-41dd-9665-f0094182f952', emailDemande);
      return response.data;
  } catch (error) {
      console.error('Error submitting email demande', error);
      throw error;
  }
};

export const sendEmailInscription = async (emailInscription: EmailInscription): Promise<EmailInscription> => {
  try {
      const response = await n8n.post('/2ee7923b-d06e-4fd8-ab10-70dd4688c4f0', emailInscription);
      return response.data;
  } catch (error) {
      console.error('Error submitting email demande', error);
      throw error;
  }
};

export const getEmails = async (): Promise<any> => {
  try {
      const response = await api.post('/visiteursEmail');
      return response.data;

  } catch (error) {
      console.error('Error submitting email demande', error);
      throw error;
  }
};

export const sendEmailInscriptionAdherent = async (emailInscription: EmailInscription): Promise<EmailInscription> => {
  try {
      const emails = await getEmails()
      console.log(emails[0].emails)
      const response = await n8n.post('/a7f0a253-cc6d-4b77-8111-35746db35f99', emailInscription);
      return response.data;
  } catch (error) {
      console.error('Error submitting email demande', error);
      throw error;
  }
};

export const verifEmail = async (verifEmail: VerifEmail): Promise<VerifEmail> => {
  try {
      const response = await api.post('/verifEmail', verifEmail);
      return response.data;
  } catch (error) {
      console.error('Error verifEmail', error);
      throw error;
  }
};

export const verifVisiteur = async (verifVisiteur: VerifVisiteur): Promise<VerifVisiteur> => {
  try {
      const response = await api.post('/verifVisiteur', verifVisiteur);
      return response.data.response;
  } catch (error) {
      console.error('Error verifDemande', error);
      throw error;
  }
};

export const removeInscription = async (DeleteInscriptionValidationRequest: DeleteInscriptionValidationRequest): Promise<VerifVisiteur> => {
  try {
      const response = await api.post('/deleteInscriptions', DeleteInscriptionValidationRequest);
      return response.data;
  } catch (error) {
      console.error('Error deleteInscriptions', error);
      throw error;
  }
};