export interface Movement {
  id: string;
  type: "entry" | "exit";
  amount: number;
  currency: "MGA" | "RMB" | "AED" | "EUR" | "USD";
  exchangeRate?: number;
  amountMGA: number; // calculé
  description: string;
  date: Date;
  author: string; // user connecté
  responsible: string; // user sélectionné
  isSale: boolean; // vente (recette régulière)
  createdAt: Date;
  updatedAt: Date;
}

export interface Trosa {
  id: string;
  userId: number;
  description: string;
  debtorName: string; // nom du débiteur
  montantTotal: number;
  datePaiement?: Date; // rempli quand entièrement payé
  isPaid: boolean; // statut de paiement
  createdAt: Date;
  updatedAt: Date;
  // Relations
  payments?: TrosaPayment[];
  totalPaid?: number; // calculé côté frontend
  remainingAmount?: number; // calculé côté frontend
}

export interface TrosaPayment {
  id: string;
  trosaId: string;
  montant: number;
  datePaiement: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
