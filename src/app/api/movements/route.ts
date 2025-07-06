import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { movements } from "@/drizzle/schema";
import { and, desc, eq, count } from "drizzle-orm";
import { DEFAULT_EXCHANGE_RATES, calculateAmountMGA } from "@/lib/currency";

export async function GET(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const userMovements = await db
      .select()
      .from(movements)
      .orderBy(desc(movements.id))
      .limit(limit)
      .offset(offset);

    const totalMovements = await db
      .select({ value: count() })
      .from(movements);

    return NextResponse.json({
      movements: userMovements,
      totalMovements: totalMovements[0].value,
    });
  } catch (error) {
    console.error("Error fetching movements:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
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
      return NextResponse.json(
        { message: "Tous les champs requis ne sont pas fournis" },
        { status: 400 },
      );
    }

    const finalExchangeRate = exchangeRate || DEFAULT_EXCHANGE_RATES[currency];
    const amountMGA = calculateAmountMGA(amount, currency, finalExchangeRate);

    await db.insert(movements).values({
      userId: userId,
      type: type,
      amount: amount.toString(), // Drizzle stores numeric as string
      currency: currency,
      exchangeRate: finalExchangeRate
        ? finalExchangeRate.toString()
        : undefined,
      amountMGA: amountMGA.toString(),
      description: description,
      date: new Date(date),
      author: author,
      responsible: responsible,
    });

    return NextResponse.json(
      { message: "Mouvement ajouté avec succès" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding movement:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID du mouvement manquant" },
        { status: 400 },
      );
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
      responsible,
    } = body;

    if (
      !type ||
      !amount ||
      !currency ||
      !description ||
      !date ||
      !responsible
    ) {
      return NextResponse.json(
        { message: "Tous les champs requis ne sont pas fournis" },
        { status: 400 },
      );
    }

    const finalExchangeRate = exchangeRate || DEFAULT_EXCHANGE_RATES[currency];
    const amountMGA = calculateAmountMGA(amount, currency, finalExchangeRate);

    await db
      .update(movements)
      .set({
        type,
        amount: amount.toString(),
        currency: currency,
        exchangeRate: finalExchangeRate
          ? finalExchangeRate.toString()
          : undefined,
        amountMGA: amountMGA.toString(),
        description,
        date: new Date(date),
        responsible,
      })
      .where(and(eq(movements.id, parseInt(id)), eq(movements.userId, userId)));

    return NextResponse.json(
      { message: "Mouvement mis à jour avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating movement:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID du mouvement manquant" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    await db
      .delete(movements)
      .where(and(eq(movements.id, parseInt(id)), eq(movements.userId, userId)));

    return NextResponse.json(
      { message: "Mouvement supprimé avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting movement:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
