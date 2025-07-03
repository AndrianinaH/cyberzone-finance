"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import * as React from "react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Movement } from "@/types";

interface EditMovementModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  movement: Movement;
  onMovementUpdated: () => void;
}

export function EditMovementModal({ isOpen, onOpenChange, movement, onMovementUpdated }: EditMovementModalProps) {
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [movementType, setMovementType] = useState<"entry" | "exit">("entry");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [responsible, setResponsible] = useState<string>("");
  const [usersList, setUsersList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (movement) {
      setDate(new Date(movement.date));
      setMovementType(movement.type);
      setAmount(movement.amount.toString());
      setCurrency(movement.currency);
      setExchangeRate(movement.exchangeRate?.toString() || "");
      setDescription(movement.description);
      setResponsible(movement.responsible);
    }
  }, [movement]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsersList(data);
        } else {
          toast({
            title: "Erreur",
            description: "Erreur lors du chargement des utilisateurs.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Erreur",
          description: "Impossible de se connecter au serveur pour les utilisateurs.",
          variant: "destructive",
        });
      }
    };
    fetchUsers();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedMovement = {
      id: movement.id,
      type: movementType,
      amount: parseFloat(amount),
      currency,
      exchangeRate: exchangeRate ? parseFloat(exchangeRate) : undefined,
      description,
      date: date?.toISOString(),
      responsible,
    };

    try {
      const res = await fetch(`/api/movements?id=${movement.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMovement),
      });

      if (res.ok) {
        toast({
          title: "Succès",
          description: "Mouvement mis à jour avec succès.",
          variant: "success",
        });
        onOpenChange(false);
        onMovementUpdated();
      } else {
        const errorData = await res.json();
        toast({
          title: "Erreur",
          description: errorData.message || "Erreur lors de la mise à jour du mouvement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update movement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le Mouvement</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <ToggleGroup
              type="single"
              value={movementType}
              onValueChange={(value: "entry" | "exit") => setMovementType(value)}
              className="col-span-3"
            >
              <ToggleGroupItem value="entry" aria-label="Toggle entry" className="flex-1 data-[state=on]:bg-green-500 data-[state=on]:text-white">
                Entrée
              </ToggleGroupItem>
              <ToggleGroupItem value="exit" aria-label="Toggle exit" className="flex-1 data-[state=on]:bg-red-500 data-[state=on]:text-white">
                Sortie
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Montant
            </Label>
            <Input id="amount" type="number" placeholder="0.00" className="col-span-3" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">
              Devise
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner une devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MGA">MGA</SelectItem>
                <SelectItem value="RMB">RMB</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exchangeRate" className="text-right">
              Taux de change
            </Label>
            <Input id="exchangeRate" type="number" placeholder="1.00" className="col-span-3" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" placeholder="Description du mouvement" className="col-span-3" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={
                    "col-span-3 w-[240px] justify-start text-left font-normal " +
                    (!date && "text-muted-foreground")
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="responsible" className="text-right">
              Responsable
            </Label>
            <Select value={responsible} onValueChange={setResponsible}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un responsable" />
              </SelectTrigger>
              <SelectContent>
                {usersList.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Mettre à jour</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
