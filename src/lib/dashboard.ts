import { db } from "@/lib/db";
import { movements } from "@/drizzle/schema";
import { gte } from "drizzle-orm";

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
