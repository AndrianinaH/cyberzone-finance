"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

interface AddMovementModalProps {
  children: React.ReactNode;
}

export function AddMovementModal({ children }: AddMovementModalProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [movementType, setMovementType] = React.useState<"entry" | "exit">("entry");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Mouvement</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4">
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
            <Input id="amount" type="number" placeholder="0.00" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">
              Devise
            </Label>
            <Select defaultValue="MGA">
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
            <Input id="exchangeRate" type="number" placeholder="1.00" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" placeholder="Description du mouvement" className="col-span-3" />
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
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un responsable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">John Doe</SelectItem>
                <SelectItem value="user2">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
