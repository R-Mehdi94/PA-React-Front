export type DemandeType = 'Projet' | 'Evénement' | 'Parrainage' | 'Autre';
export type StatutType = 'En attente' | 'Acceptée' | 'Refusée';

export interface Demande {
  id?: number;
  type: DemandeType;
  dateDemande?: string;
  statut: StatutType;
  adherent?: number;
  visiteur?: number;
  email?: string;
  nom?: string;
  prenom?: string;
  age?: number;
  numTel?: string;
  profession?: string;
}


export interface AutreDemande {
  id?: number;
  demandeId?: number;
  titre: string;
  description: string;
  demande:number;
}

export interface EvenementDemande {
  id?: number;
  demandeId?: number;
  titre: string;
  date: string;
  description: string;
  lieu: string;
  demande:number;
}

export interface AideProjetDemande {
  id?: number;
  demandeId?: number;
  titre: string;
  descriptionProjet: string;
  budget?: number;
  deadline?: string;
  demande:number;
}

export interface ParrainageDemande2 {
  id?: number;
  parrain?: number;
  demandeId?: number;
  detailsParrainage: string;
  demande:number;
  numTel?:number;
}

export interface ParrainageDemande {
  id?: number;
  parrain?: number;
  demandeId?: number;
  detailsParrainage: string;
  demande:number;
}
