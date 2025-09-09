"use client";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit, CreditCard } from "lucide-react";
import { Trosa } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatNumber } from "@/lib/utils";
import { AddTrosaModal } from "@/components/AddTrosaModal";
import { EditTrosaModal } from "@/components/EditTrosaModal";
import { TrosaPaymentsModal } from "@/components/TrosaPaymentsModal";

export default function TrosaPage() {
  const [trosaList, setTrosaList] = useState<Trosa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [selectedTrosa, setSelectedTrosa] = useState<Trosa | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalTrosa, setTotalTrosa] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTrosa = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        q: searchTerm,
        status: statusFilter,
      });
      const res = await fetch(`/api/trosa?${params.toString()}`);
      if (res.ok) {
        const { trosa: data, totalTrosa: total } = await res.json();
        setTrosaList(data);
        setTotalTrosa(total);
      } else {
        const errorData = await res.json();
        toast({
          title: "Erreur",
          description:
            errorData.message || "Erreur lors du chargement des trosa.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch trosa:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, currentPage, itemsPerPage, searchTerm, statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTrosa();
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [fetchTrosa]);

  const handleEdit = (trosa: Trosa) => {
    setSelectedTrosa(trosa);
    setIsEditModalOpen(true);
  };

  const handleViewPayments = (trosa: Trosa) => {
    setSelectedTrosa(trosa);
    setIsPaymentsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/trosa?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Succès",
          description: "Trosa supprimé avec succès.",
          variant: "success",
        });
        fetchTrosa();
      } else {
        const errorData = await res.json();
        toast({
          title: "Erreur",
          description:
            errorData.message || "Erreur lors de la suppression du trosa.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete trosa:", error);
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
        <p>Chargement des trosa...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-4 sm:p-8">
      <h1 className="mb-8 text-4xl font-bold">Gestion des Trosa (Dettes)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Trosa Récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <Input
              placeholder="Rechercher par description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-sm"
              autoFocus
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="paid">Payés</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant Total</TableHead>
                  <TableHead>Payé</TableHead>
                  <TableHead>Restant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date Création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trosaList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Aucun trosa trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  trosaList.map((trosa) => (
                    <TableRow key={trosa.id}>
                      <TableCell className="font-medium">
                        {trosa.description}
                      </TableCell>
                      <TableCell>
                        {formatNumber(trosa.montantTotal)} MGA
                      </TableCell>
                      <TableCell className="text-green-600">
                        {formatNumber(trosa.totalPaid || 0)} MGA
                      </TableCell>
                      <TableCell className="text-orange-600">
                        {formatNumber(trosa.remainingAmount || 0)} MGA
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trosa.isPaid 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {trosa.isPaid ? 'Payé' : 'Actif'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(trosa.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPayments(trosa)}
                          title="Voir/Gérer les paiements"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(trosa)}
                          disabled={trosa.isPaid}
                        >
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
                              <AlertDialogTitle>
                                Êtes-vous absolument sûr ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela
                                supprimera définitivement ce trosa et tous ses
                                paiements associés.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(trosa.id)}
                              >
                                Continuer
                              </AlertDialogAction>
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
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= totalTrosa}
              >
                Suivant
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Page {currentPage} sur{" "}
                {Math.ceil(totalTrosa / itemsPerPage)}
              </span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 lignes</SelectItem>
                  <SelectItem value="25">25 lignes</SelectItem>
                  <SelectItem value="50">50 lignes</SelectItem>
                  <SelectItem value="100">100 lignes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddTrosaModal onTrosaAdded={fetchTrosa}>
        <Button
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg p-0 flex items-center justify-center"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </AddTrosaModal>

      {selectedTrosa && (
        <>
          <EditTrosaModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            trosa={selectedTrosa}
            onTrosaUpdated={fetchTrosa}
          />
          <TrosaPaymentsModal
            isOpen={isPaymentsModalOpen}
            onOpenChange={setIsPaymentsModalOpen}
            trosa={selectedTrosa}
            onPaymentAdded={fetchTrosa}
          />
        </>
      )}
    </div>
  );
}