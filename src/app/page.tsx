"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";

interface Balance {
  mga: number;
  rmb: number;
}

interface DailyMovements {
  entries: {
    mga: number;
    rmb: number;
  };
  exits: {
    mga: number;
    rmb: number;
  };
}

export default function Home() {
  const [balance, setBalance] = useState<Balance>({ mga: 0, rmb: 0 });
  const [dailyMovements, setDailyMovements] = useState<DailyMovements>({
    entries: { mga: 0, rmb: 0 },
    exits: { mga: 0, rmb: 0 },
  });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/balance");
        if (response.ok) {
          const data = await response.json();
          setBalance(data);
        } else {
          console.error("Failed to fetch balance");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    const fetchDailyMovements = async () => {
      try {
        const response = await fetch("/api/daily-movements");
        if (response.ok) {
          const data = await response.json();
          setDailyMovements(data);
        } else {
          console.error("Failed to fetch daily movements");
        }
      } catch (error) {
        console.error("Error fetching daily movements:", error);
      }
    };

    fetchBalance();
    fetchDailyMovements();
  }, []);

  return (
    <div className="flex min-h-screen flex-col p-4 sm:p-8">
      <h1 className="mb-8 text-4xl font-bold">Tableau de Bord</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde Global (MGA)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.mga.toLocaleString()} MGA
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde Global (RMB)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.rmb.toLocaleString()} RMB
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entrées du Jour
            </CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              +{dailyMovements.entries.mga.toLocaleString()} MGA
            </div>
            <div className="text-xl font-bold">
              +{dailyMovements.entries.rmb.toLocaleString()} RMB
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sorties du Jour
            </CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              -{dailyMovements.exits.mga.toLocaleString()} MGA
            </div>
            <div className="text-xl font-bold">
              -{dailyMovements.exits.rmb.toLocaleString()} RMB
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Graphique des 7 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 w-full items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Placeholder pour le graphique
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Toggle Période</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Button variant="outline">Jour</Button>
              <Button variant="outline">Semaine</Button>
              <Button variant="outline">Mois</Button>
              <Button variant="outline">Année</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}