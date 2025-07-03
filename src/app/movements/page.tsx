"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Movement } from "@/types";
import { AddMovementModal } from "@/components/AddMovementModal";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EditMovementModal } from "@/components/EditMovementModal";

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const { toast } = useToast();

  const fetchMovements = useCallback(async () => {
    try {
      const res = await fetch("/api/movements");
      if (res.ok) {
        const data: Movement[] = await res.json();
        setMovements(data);
      } else {
        const errorData = await res.json();
        toast({
          title: "Erreur",
          description:
            errorData.message || "Erreur lors du chargement des mouvements.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch movements:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const handleEdit = (movement: Movement) => {
    setSelectedMovement(movement);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/movements?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Succès",
          description: "Mouvement supprimé avec succès.",
          variant: "success",
        });
        fetchMovements();
      } else {
        const errorData = await res.json();
        toast({
          title: "Erreur",
          description: errorData.message || "Erreur lors de la suppression du mouvement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete movement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col p-4 sm:p-8 items-center justify-center">
        <p>Chargement des mouvements...</p>
      </div>
    );
  }

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
                {movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Aucun mouvement trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell
                        className={
                          movement.type === "entry"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {movement.type === "entry" ? "Entrée" : "Sortie"}
                      </TableCell>
                      <TableCell>
                        {movement.amountMGA.toLocaleString()} MGA
                      </TableCell>
                      <TableCell>{movement.description}</TableCell>
                      <TableCell>
                        {new Date(movement.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{movement.responsible}</TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(movement)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela supprimera définitivement ce mouvement de nos serveurs.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(movement.id)}>Continuer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddMovementModal onMovementAdded={fetchMovements}>
        <Button
          className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </AddMovementModal>

      {selectedMovement && (
        <EditMovementModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          movement={selectedMovement}
          onMovementUpdated={fetchMovements}
        />
      )}
    </div>
  );
}