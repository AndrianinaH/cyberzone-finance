import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import {
  getBalance,
  getDailyMovements,
  getChartData,
  getResponsibleMGAData,
} from "@/lib/dashboard";
import DailyBalanceChart from "@/components/DailyBalanceChart";
import ResponsibleMGAChart from "@/components/ResponsibleMGAChart";

export default async function Home() {
  const balance = await getBalance();
  const dailyMovements = await getDailyMovements();
  const chartData = await getChartData();
  const responsibleMGAData = await getResponsibleMGAData();

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
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mb-2 text-green-700">
              +{dailyMovements.entries.mga.toLocaleString()} MGA
            </div>
            <div className="text-lg font-bold text-green-700">
              +{dailyMovements.entries.rmb.toLocaleString()} RMB
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sorties du Jour
            </CardTitle>
            <ArrowDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mb-2 text-red-700">
              -{dailyMovements.exits.mga.toLocaleString()} MGA
            </div>
            <div className="text-lg font-bold text-red-700">
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
            <DailyBalanceChart data={chartData} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Total MGA par Actionnaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsibleMGAChart data={responsibleMGAData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
