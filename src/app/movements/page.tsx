import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Movement } from "@/types";
import { AddMovementModal } from "@/components/AddMovementModal";

export default function MovementsPage() {
  const mockMovements: Movement[] = [
    {
      id: "1",
      type: "entry",
      amount: 100000,
      currency: "MGA",
      amountMGA: 100000,
      description: "Vente smartphone",
      date: new Date(),
      author: "Admin",
      responsible: "John Doe",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      type: "exit",
      amount: 50000,
      currency: "MGA",
      amountMGA: 50000,
      description: "Achat fournitures",
      date: new Date(),
      author: "Admin",
      responsible: "Jane Smith",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col p-4 sm:p-8">
      <h1 className="mb-8 text-4xl font-bold">Gestion des Mouvements</h1>

      <Card>
        <CardHeader>
          <CardTitle>Mouvements Récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell
                    className={movement.type === "entry" ? "text-green-500" : "text-red-500"}
                  >
                    {movement.type === "entry" ? "Entrée" : "Sortie"}
                  </TableCell>
                  <TableCell>{movement.amountMGA.toLocaleString()} MGA</TableCell>
                  <TableCell>{movement.description}</TableCell>
                  <TableCell>{movement.date.toLocaleDateString()}</TableCell>
                  <TableCell>{movement.responsible}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-2">Éditer</Button>
                    <Button variant="destructive" size="sm">Supprimer</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <AddMovementModal>
        <Button
          className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </AddMovementModal>
    </div>
  );
}
