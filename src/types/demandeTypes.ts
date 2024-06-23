export type DemandeType = 'Projet' | 'Evénement' | 'Parrainage' | 'Autre';
export type StatutType = 'En attente' | 'Acceptée' | 'Refusée';

export interface Demande {
  id?: number;
  type: DemandeType;
  dateDemande?: string;
  statut: StatutType;
  emailVisiteur: string;
}

export interface AutreDemande {
  id?: number;
  demandeId?: number;
  titre: string;
  description: string;
}

export interface EvenementDemande {
  id?: number;
  demandeId?: number;
  titre: string;
  date: string;
  description: string;
  lieu: string;
}

export interface AideProjetDemande {
  id?: number;
  demandeId?: number;
  titre: string;
  descriptionProjet: string;
  budget?: number;
  deadline?: string;
}

export interface ParrainageDemande {
  id?: number;
  parrainId?: number;
  demandeId?: number;
  detailsParrainage: string;
}
