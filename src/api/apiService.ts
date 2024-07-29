import axios from 'axios';
import { AideProjetDemande, AutreDemande, Demande, DemandeType, EvenementDemande, ParrainageDemande } from '../types/demandeTypes';


export enum UserRole {
  Administrateur = "Administrateur",
  Utilisateur = "Utilisateur"
}



export enum typeCotisation {
  cadre = "cadre",
  etudiant = "etudiant",
  chefEntreprise = "chefEntreprise",
  autre = "autre"
}

export interface AideProjet{
  id:number
  titre: string
  descriptionProjet: string
  budget: number
  deadline: Date
}

export interface Cotisation {
  id: number
  type: typeCotisation
  Ajours: boolean
  user: User
  adherent: Adherent
  date: string
}


export interface CreateCotisation {
  type: typeCotisation
  Ajours: boolean
  user?: User
  adherent?: Adherent
}

export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  motDePasse: string
  numTel: string
  profession: string
  role: UserRole
  dateInscription: Date
  estBenevole: boolean
}
  
 export interface GetUsersResponse {
    Users: User[];
    totalCount: number;
  }



export interface Visiteur {
    id:number
    email: string
    nom: string
    prenom: string
    age: number
    numTel: string
    profession: string
}

export interface UpdateVisiteur{
  visiteur: Visiteur
}

export interface CreateVisiteur {
  email: string
  nom: string
  prenom: string
  age: number
  numTel: string
  profession: string
  estBanie: boolean
}

export interface CreateAdherent{
  email: string
  motDePasse: string
  nom: string
  prenom: string
  age: number
  numTel: string
  adresse: string
  profession: string
  estBanie: boolean
  estBenevole: boolean
}

export interface Adherent {
  id:number
  email: string
  motDePasse: string
  nom: string
  prenom: string
  age: number
  numTel: string
  adresse: string
  profession: string
  estBanie: boolean
  estBenevole: boolean
  token: string
  parrain: User
}

export interface UpdateAdherent{
    adherent: Adherent
    token: string
}

export enum TypeTransaction {
    Don = "Don",
    PaiementCotisations = "Cotisation",
    Inscription = "Inscription"
}

export interface Transaction{
  id:number
  montant: number
  methodePaiement: string
  type: TypeTransaction
  visiteur?: Visiteur
  adherent?: Adherent
}

export interface CreateTransaction{
  montant: number
  methodePaiement: string
  type: TypeTransaction
  visiteur?: Visiteur
  adherent?: Adherent
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

export interface InscriptionAdherent{
  adherent:number,
  evenement:number
}

export interface InscriptionVisiteur{
  visiteur:number,
  evenement:number
}

export interface EmailInscription{
  mail:string,
  evenement:string,
  date:Date,
  lieu:string
}

export interface EmailDesinscription{
  mail:string,
  evenement:string,
}

export interface VerifEmail {
  id: number
  evenement: number
}

export interface VerifChangementMdp {
  email: string
  numTel: string
}
export interface ForgotMdp {
  email: string
  motDePasse: string
}


export interface VerifVisiteur {
  email: string
}

export interface Logout {
  id: number
  token: string
}

export interface DeleteInscriptionValidationRequest {
  visiteur: number
  evenement: number
}
export interface DeleteInscriptionAdherent{
  adherent: number
  evenement: number
}


export interface Login{
  email:string,
  motDePasse:string
}


const api = axios.create({
  baseURL: 'https://pa-api-0tcm.onrender.com/', 
  //baseURL:'http://localhost:3000/'
});

const n8n = axios.create({
  baseURL: 'https://mehdikit94.app.n8n.cloud/webhook', 
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

export const getDemandes = async (id:number): Promise<any> => {
  try {
    const response = await api.get(`/demandes?adherent=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const getProjects = async (id:number): Promise<any> => {
  try {
    const response = await api.get(`/aide-projets?adherent=${id}`);
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

export const getEvenemntsUser = async (id:number): Promise<any> => {
  try {
    const response = await api.get(`inscriptions?adherent=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};


export const getDonsUser = async (id:number): Promise<any> => {
  try {
    const response = await api.get(`transactions?adherent=${id}&type=Don`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const getCotisationsUser = async (id:number): Promise<any> => {
  try {
    const response = await api.get(`cotisations?adherent=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const getVisiteurParMail = async (mail:string): Promise<Visiteur> => {
  try {
    const response = await api.get(`visiteurs?email=${mail}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};



export const updateVisiteur = async (updateVisiteur: UpdateVisiteur): Promise<Visiteur|null> => {
  try {
    console.log(updateVisiteur)

    const updateAdherentSansId = {
      //@ts-ignore
      email: updateVisiteur.email,
      //@ts-ignore
      nom: updateVisiteur.nom,
      //@ts-ignore
      prenom: updateVisiteur.prenom,
      //@ts-ignore

      age: updateVisiteur.age,
      //@ts-ignore

      numTel: updateVisiteur.numTel,
      //@ts-ignore

      profession: updateVisiteur.profession,
      estBanie: false,
    };
    //@ts-ignore
    const response = await api.patch(`/visiteurs/${updateVisiteur.id}`, updateAdherentSansId, {

    });

    return response.data;
  } catch (error) {
    console.error('Error updating adherent', error);
    return null;
  }
};


export const updateAdherent = async (updateAdherent: UpdateAdherent): Promise<Adherent|null> => {
  try {
    const { adherent, token } = updateAdherent;

    const updateAdherentSansId = {
      email: adherent.email,
      motDePasse: adherent.motDePasse,
      nom: adherent.nom,
      prenom: adherent.prenom,
      age: adherent.age,
      numTel: adherent.numTel,
      adresse: adherent.adresse,
      profession: adherent.profession,
      estBanie: adherent.estBanie,
      estBenevole: adherent.estBenevole,
      token: token
    };

    const response = await api.patch(`/adherents/${adherent.id}`, updateAdherentSansId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating adherent', error);
    return null;
  }
};

export const login= async (login:Login): Promise<Adherent> => {
  try {
      const response = await api.post('/auth/loginAdherent', login);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const logout= async (logout:Logout): Promise<JSON> => {
  try {
      console.log(`/auth/logoutAdherent/${logout.id}`)
      const response = await api.delete(`/auth/logoutAdherent/${logout.id}`, { data: { token: logout.token }});
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const createInscriptionAdherent= async (inscription:InscriptionAdherent): Promise<InscriptionAdherent> => {
  try {
      const response = await api.post('/inscriptions', inscription);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const createInscriptionVisiteur= async (inscription:InscriptionVisiteur): Promise<InscriptionVisiteur> => {
  try {
      const response = await api.post('/inscriptions', inscription);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const createVisiteur= async (visiteur:CreateVisiteur) => {
  try {
      const response = await api.post('/visiteurs', visiteur);
      return response;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const createAdherent= async (adherent:CreateAdherent) => {
  try {
      const response = await api.post('/auth/signupAdherent', adherent);
      return response;
  } catch (error) {
      console.error('Error creating donation', error);
      return null;
  }
};


export const createTransaction = async (transaction:CreateTransaction): Promise<TransactionCree> => {
  try {
      const response = await api.post('/transactions', transaction);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const createCotisation = async (cotisation:CreateCotisation): Promise<TransactionCree> => {
  try {
      const response = await api.post('/cotisations', cotisation);
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      throw error;
  }
};

export const changePassword = async (id:number, oldPassword:string, newPassword:string, token:string): Promise<TransactionCree|null> => {
  try {
      const response = await api.patch(`/adherents/${id}`, {id, oldPassword, newPassword, token});
      console.log(response)
      return response.data;
  } catch (error) {
      console.error('Error creating donation', error);
      return null;
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

export const sendMdpOublie = async (forgotMdp: ForgotMdp): Promise<EmailDon> => {
  try {
      const response = await n8n.post('/1b650191-3165-4744-87fc-267e1d44f0aa', forgotMdp);
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

export const sendEmailDesinscription = async (emailDesinscription: EmailDesinscription): Promise<EmailDesinscription> => {
  try {
      const response = await n8n.post('/96e4cedb-f5a4-46b5-8c46-408c7ea16a1a', emailDesinscription);
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

export const verifEmailAdherent = async (verifEmail: VerifEmail): Promise<VerifEmail> => {
  try {
      const response = await api.post('/verifEmailAdherent', verifEmail);
      return response.data;
  } catch (error) {
      console.error('Error verifEmail', error);
      throw error;
  }
};

export const verifEmailVisiteur = async (verifEmail: VerifEmail): Promise<VerifEmail> => {
  try {
      const response = await api.post('/verifEmailVisiteur', verifEmail);
      return response.data;
  } catch (error) {
      console.error('Error verifEmail', error);
      throw error;
  }
};

export const verifChangementMdp = async (verifChangementMdp: VerifChangementMdp): Promise<VerifEmail> => {
  try {
      const response = await api.post('/verifAdherentMdp', verifChangementMdp);
      return response.data;
  } catch (error) {
      console.error('Error verifEmail', error);
      throw error;
  }
};

export const forgotPassword = async (forgotMdp: ForgotMdp): Promise<VerifEmail> => {
  try {
      const response = await api.patch('/adherentsMdp', forgotMdp);
      return response.data;
  } catch (error) {
      console.error('Error verifEmail', error);
      throw error;
  }
};

export const verifVisiteur = async (verifVisiteur: VerifVisiteur): Promise<VerifVisiteur> => {
  try {
    console.log(verifVisiteur)
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

export const deleteAccount = async (id: number, token: string): Promise<any> => {
  try {
    const response = await api.delete(`/adherents/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { id, token }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting account', error);
    return null
  }
};

export const removeInscriptionAdherent = async (deleteInscriptionAdherent: DeleteInscriptionAdherent): Promise<VerifVisiteur> => {
  try {
      const response = await api.post('/deleteInscriptionAdherent', deleteInscriptionAdherent);
      return response.data;
  } catch (error) {
      console.error('Error deleteInscriptions', error);
      throw error;
  }

  
};