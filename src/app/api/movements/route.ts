import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { movements } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const userId = session.user.id;

    const userMovements = await db
      .select()
      .from(movements)
      .where(eq(movements.userId, userId));

    return NextResponse.json(userMovements);
  } catch (error) {
    console.error("Error fetching movements:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const {
      type,
      amount,
      currency,
      exchangeRate,
      description,
      date,
      author,
      responsible,
    } = body;

    if (
      !type ||
      !amount ||
      !currency ||
      !description ||
      !date ||
      !author ||
      !responsible
    ) {
      return new NextResponse("Tous les champs requis ne sont pas fournis", {
        status: 400,
      });
    }

    const amountMGA =
      currency === "MGA" ? amount : amount * (exchangeRate || 1);

    await db.insert(movements).values({
      userId: userId,
      type: type,
      amount: amount.toString(), // Drizzle stores numeric as string
      currency: currency,
      exchangeRate: exchangeRate ? exchangeRate.toString() : undefined,
      amountMGA: amountMGA.toString(),
      description: description,
      date: new Date(date),
      author: author,
      responsible: responsible,
    });

    return new NextResponse("Mouvement ajouté avec succès", { status: 201 });
  } catch (error) {
    console.error("Error adding movement:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
