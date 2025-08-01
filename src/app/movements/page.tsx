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
import { Plus, Trash2, Edit } from "lucide-react";
import { Movement } from "@/types";
import { AddMovementModal } from "@/components/AddMovementModal";
import { useState, useEffect, useCallback } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
import { EditMovementModal } from "@/components/EditMovementModal";
import { formatNumber } from "@/lib/utils";

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalMovements, setTotalMovements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        q: searchTerm, // Use description to pass the search term
        type: searchType,
        ...(dateRange?.from && { startDate: dateRange.from.toISOString() }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString() }),
      });
      const res = await fetch(`/api/movements?${params.toString()}`);
      if (res.ok) {
        const { movements: data, totalMovements: total } = await res.json();
        setMovements(data);
        setTotalMovements(total);
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
  }, [toast, currentPage, itemsPerPage, searchTerm, searchType, dateRange]);

  useEffect(() => {
    // debounce to avoid fetching for each char typed by the user
    const handler = setTimeout(() => {
      fetchMovements();
    }, 500);
    return () => {
      clearTimeout(handler);
    };
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
          description:
            errorData.message || "Erreur lors de la suppression du mouvement.",
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
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <Input
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-sm"
              autoFocus
            />
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[280px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", { locale: fr })} -{" "}
                        {format(dateRange.to, "LLL dd, y", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale: fr })
                    )
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col space-y-2 p-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDateRange(undefined);
                        setDatePickerOpen(false);
                      }}
                    >
                      Effacer
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const today = new Date();
                        setDateRange({ from: today, to: today });
                        setDatePickerOpen(false);
                      }}
                    >
                      {`Aujourd'hui`}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const today = new Date();
                        setDateRange({ from: subDays(today, 6), to: today });
                        setDatePickerOpen(false);
                      }}
                    >
                      7 derniers jours
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const today = new Date();
                        setDateRange({
                          from: startOfMonth(today),
                          to: endOfMonth(today),
                        });
                        setDatePickerOpen(false);
                      }}
                    >
                      Ce mois
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const today = new Date();
                        setDateRange({
                          from: startOfYear(today),
                          to: endOfYear(today),
                        });
                        setDatePickerOpen(false);
                      }}
                    >
                      Cette année
                    </Button>
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    selected={dateRange as any}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={fr}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type de mouvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="entry">Entrée</SelectItem>
                <SelectItem value="exit">Sortie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Vente</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Aucun mouvement trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell
                        className={
                          movement.type === "entry"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {movement.type === "entry" ? "Entrée" : "Sortie"}
                      </TableCell>
                      <TableCell>
                        {formatNumber(movement.amountMGA)} MGA
                      </TableCell>
                      <TableCell>{movement.description}</TableCell>
                      <TableCell>
                        {new Date(movement.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{movement.responsible}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          movement.isSale 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {movement.isSale ? 'Vente' : 'Normal'}
                        </span>
                      </TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(movement)}
                        >
                          <Edit className="h-4 w-4" />
                          Editer
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Êtes-vous absolument sûr ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela
                                supprimera définitivement ce mouvement de nos
                                serveurs.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(movement.id)}
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
                disabled={currentPage * itemsPerPage >= totalMovements}
              >
                Suivant
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Page {currentPage} sur{" "}
                {Math.ceil(totalMovements / itemsPerPage)}
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

      <AddMovementModal onMovementAdded={fetchMovements}>
        <Button
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg p-0 flex items-center justify-center"
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
