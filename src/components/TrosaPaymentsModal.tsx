"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Trosa, TrosaPayment } from "@/types";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TrosaPaymentsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trosa: Trosa;
  onPaymentAdded: () => void;
}

export function TrosaPaymentsModal({
  isOpen,
  onOpenChange,
  trosa,
  onPaymentAdded,
}: TrosaPaymentsModalProps) {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<TrosaPayment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    montant: "",
    datePaiement: new Date(),
    description: "",
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/trosa/${trosa.id}/payments`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, trosa.id]);

  const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.montant.toString()), 0);
  const remainingAmount = parseFloat(trosa.montantTotal.toString()) - totalPaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/trosa/${trosa.id}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          montant: parseFloat(formData.montant),
          datePaiement: formData.datePaiement.toISOString(),
          description: formData.description || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Succès",
          description: data.message || "Paiement ajouté avec succès.",
          variant: "success",
        });
        setFormData({
          montant: "",
          datePaiement: new Date(),
          description: "",
        });
        setShowAddForm(false);
        fetchPayments();
        onPaymentAdded(); // Rafraîchir la liste principale des trosa
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Erreur lors de l'ajout du paiement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to add payment:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/trosa/${trosa.id}/payments?paymentId=${paymentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Succès",
          description: data.message || "Paiement supprimé avec succès.",
          variant: "success",
        });
        fetchPayments();
        onPaymentAdded(); // Rafraîchir la liste principale des trosa
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Erreur lors de la suppression du paiement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete payment:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paiements - {trosa.description}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Résumé */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Total:</span>
                <p className="text-lg font-bold">{formatNumber(trosa.montantTotal)} MGA</p>
              </div>
              <div>
                <span className="font-medium text-green-600">Payé:</span>
                <p className="text-lg font-bold text-green-600">{formatNumber(totalPaid)} MGA</p>
              </div>
              <div>
                <span className="font-medium text-orange-600">Restant:</span>
                <p className="text-lg font-bold text-orange-600">{formatNumber(remainingAmount)} MGA</p>
              </div>
            </div>
            {trosa.isPaid && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  ✓ Entièrement payé le {trosa.datePaiement ? new Date(trosa.datePaiement).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            )}
          </div>

          {/* Bouton pour ajouter un paiement */}
          {!trosa.isPaid && (
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full"
              variant={showAddForm ? "outline" : "default"}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showAddForm ? "Annuler" : "Ajouter un paiement"}
            </Button>
          )}

          {/* Formulaire d'ajout */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="montant">Montant (MGA)</Label>
                  <Input
                    id="montant"
                    name="montant"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={remainingAmount}
                    value={formData.montant}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de paiement</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.datePaiement && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.datePaiement ? (
                          format(formData.datePaiement, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.datePaiement}
                        onSelect={(date) => {
                          if (date) {
                            setFormData((prev) => ({ ...prev, datePaiement: date }));
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Note sur ce paiement..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Ajout..." : "Ajouter"}
                </Button>
              </div>
            </form>
          )}

          {/* Liste des paiements */}
          <div className="space-y-2">
            <h4 className="font-medium">Historique des paiements</h4>
            {payments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Aucun paiement enregistré
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.datePaiement).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatNumber(payment.montant)} MGA
                      </TableCell>
                      <TableCell>
                        {payment.description || "-"}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Supprimer ce paiement ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Le paiement de{" "}
                                {formatNumber(payment.montant)} MGA sera supprimé.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePayment(payment.id)}
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}