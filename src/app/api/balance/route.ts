
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { movements } from "@/drizzle/schema";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const allMovements = await db.select().from(movements);

    const totals = allMovements.reduce(
      (acc, movement) => {
        const amount = parseFloat(movement.amount);
        const value = movement.type === "entry" ? amount : -amount;

        if (movement.currency === "RMB") {
          acc.rmb += value;
        } else {
          acc.mga += value;
        }
        return acc;
      },
      { mga: 0, rmb: 0 },
    );

    return NextResponse.json(totals);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
