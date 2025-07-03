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
  createdAt: Date;
  updatedAt: Date;
}
