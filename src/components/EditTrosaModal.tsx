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
import { Trosa } from "@/types";
import { AutocompleteInput } from "@/components/AutocompleteInput";

interface EditTrosaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trosa: Trosa;
  onTrosaUpdated: () => void;
}

export function EditTrosaModal({
  isOpen,
  onOpenChange,
  trosa,
  onTrosaUpdated,
}: EditTrosaModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    debtorName: "",
    montantTotal: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (trosa) {
      setFormData({
        description: trosa.description,
        debtorName: trosa.debtorName,
        montantTotal: trosa.montantTotal.toString(),
      });
    }
  }, [trosa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/trosa?id=${trosa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.description,
          debtorName: formData.debtorName,
          montantTotal: formData.montantTotal ? parseFloat(formData.montantTotal) : 0,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Succès",
          description: data.message || "Trosa mis à jour avec succès.",
          variant: "success",
        });
        onOpenChange(false);
        onTrosaUpdated();
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Erreur lors de la mise à jour du trosa.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update trosa:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le Trosa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description de la dette..."
              value={formData.description}
              onChange={handleInputChange}
              required
              className="resize-none"
            />
          </div>

          <AutocompleteInput
            label="Nom du débiteur"
            placeholder="Nom de la personne qui doit l'argent..."
            value={formData.debtorName}
            onChange={(value) => setFormData(prev => ({ ...prev, debtorName: value }))}
            apiEndpoint="/api/trosa/debtors"
            id="debtorName"
            required
          />
          
          <div className="space-y-2">
            <Label htmlFor="montantTotal">Montant Total (MGA) - Optionnel</Label>
            <Input
              id="montantTotal"
              name="montantTotal"
              type="number"
              placeholder="0.00 (à définir plus tard)"
              step="0.01"
              min="0"
              value={formData.montantTotal}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}