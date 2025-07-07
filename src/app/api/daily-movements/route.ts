
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { movements } from "@/drizzle/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyMovements = await db
      .select()
      .from(movements)
      .where(gte(movements.date, today));

    const dailyTotals = dailyMovements.reduce(
      (acc, movement) => {
        const amount = parseFloat(movement.amount);
        if (movement.type === "entry") {
          if (movement.currency === "RMB") {
            acc.entries.rmb += amount;
          } else {
            acc.entries.mga += amount;
          }
        } else if (movement.type === "exit") {
          if (movement.currency === "RMB") {
            acc.exits.rmb += amount;
          } else {
            acc.exits.mga += amount;
          }
        }
        return acc;
      },
      { 
        entries: { mga: 0, rmb: 0 },
        exits: { mga: 0, rmb: 0 },
      },
    );

    return NextResponse.json(dailyTotals);
  } catch (error) {
    console.error("Error fetching daily movements:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
