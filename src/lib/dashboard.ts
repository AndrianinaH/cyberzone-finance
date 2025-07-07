import { db } from "@/lib/db";
import { movements } from "@/drizzle/schema";
import { gte, sum } from "drizzle-orm";
import { format, subDays } from "date-fns";

export async function getBalance() {
  const allMovements = await db.select().from(movements);

  const totals = allMovements.reduce(
    (acc, movement) => {
      const amount = parseFloat(movement.amount);
      const mgaAmount = parseFloat(movement.amountMGA);
      const value = movement.type === "entry" ? amount : -amount;
      const mgaValue = movement.type === "entry" ? mgaAmount : -mgaAmount;

      if (movement.currency === "RMB") {
        acc.rmb += value;
      } else {
        acc.mga += mgaValue;
      }
      return acc;
    },
    { mga: 0, rmb: 0 },
  );

  return totals;
}

export async function getDailyMovements() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyMovements = await db
    .select()
    .from(movements)
    .where(gte(movements.date, today));

  const dailyTotals = dailyMovements.reduce(
    (acc, movement) => {
      const amount = parseFloat(movement.amount);
      const mgaAmount = parseFloat(movement.amountMGA);
      if (movement.type === "entry") {
        if (movement.currency === "RMB") {
          acc.entries.rmb += amount;
        } else {
          acc.entries.mga += mgaAmount;
        }
      } else if (movement.type === "exit") {
        if (movement.currency === "RMB") {
          acc.exits.rmb += amount;
        } else {
          acc.exits.mga += mgaAmount;
        }
      }
      return acc;
    },
    {
      entries: { mga: 0, rmb: 0 },
      exits: { mga: 0, rmb: 0 },
    },
  );

  return dailyTotals;
}

export async function getChartData() {
  const sevenDaysAgo = subDays(new Date(), 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentMovements = await db
    .select()
    .from(movements)
    .where(gte(movements.date, sevenDaysAgo));

  const dailyData: { [key: string]: { mga: number; rmb: number } } = {};

  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), i);
    dailyData[format(date, "yyyy-MM-dd")] = { mga: 0, rmb: 0 };
  }

  recentMovements.forEach((movement) => {
    const dateKey = format(movement.date, "yyyy-MM-dd");
    const amount = parseFloat(movement.amount);
    const mgaAmount = parseFloat(movement.amountMGA);
    const value = movement.type === "entry" ? amount : -amount;
    const mgaValue = movement.type === "entry" ? mgaAmount : -mgaAmount;

    if (dailyData[dateKey]) {
      if (movement.currency === "RMB") {
        dailyData[dateKey].rmb += value;
      } else {
        dailyData[dateKey].mga += mgaValue;
      }
    }
  });

  const chartData = Object.keys(dailyData)
    .sort()
    .map((date) => ({
      date: format(new Date(date), "dd/MM"),
      mga: dailyData[date].mga,
      rmb: dailyData[date].rmb,
    }));

  return chartData;
}

export async function getResponsibleMGAData() {
  const data = await db
    .select({
      responsible: movements.responsible,
      totalMGA: sum(movements.amountMGA),
    })
    .from(movements)
    .groupBy(movements.responsible);

  return data.map(item => ({
    responsible: item.responsible,
    totalMGA: parseFloat(item.totalMGA || '0'),
  }));
}