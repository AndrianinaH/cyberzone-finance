"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AddTrosaModalProps {
  children: React.ReactNode;
  onTrosaAdded: () => void;
}

export function AddTrosaModal({ children, onTrosaAdded }: AddTrosaModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    montantTotal: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/trosa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.description,
          montantTotal: parseFloat(formData.montantTotal),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Succès",
          description: data.message || "Trosa ajouté avec succès.",
          variant: "success",
        });
        setFormData({ description: "", montantTotal: "" });
        setIsOpen(false);
        onTrosaAdded();
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Erreur lors de l'ajout du trosa.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to add trosa:", error);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau Trosa</DialogTitle>
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
          
          <div className="space-y-2">
            <Label htmlFor="montantTotal">Montant Total (MGA)</Label>
            <Input
              id="montantTotal"
              name="montantTotal"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.montantTotal}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}