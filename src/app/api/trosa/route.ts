import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { trosa, trosaPayments } from "@/drizzle/schema";
import { and, desc, eq, count, ilike } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;
    const searchTerm = searchParams.get("q") || "";
    const status = searchParams.get("status") || ""; // active, paid, all

    const whereClauses = [];
    
    if (searchTerm) {
      whereClauses.push(ilike(trosa.description, `%${searchTerm}%`));
    }
    
    if (status && status !== "all") {
      if (status === "active") {
        whereClauses.push(eq(trosa.isPaid, false));
      } else if (status === "paid") {
        whereClauses.push(eq(trosa.isPaid, true));
      }
    }

    const userTrosa = await db
      .select()
      .from(trosa)
      .where(and(...whereClauses))
      .orderBy(desc(trosa.id))
      .limit(limit)
      .offset(offset);

    // Pour chaque trosa, calculer le total payé
    const trosaWithPayments = await Promise.all(
      userTrosa.map(async (t) => {
        const payments = await db
          .select()
          .from(trosaPayments)
          .where(eq(trosaPayments.trosaId, t.id));

        const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.montant), 0);
        const remainingAmount = parseFloat(t.montantTotal) - totalPaid;

        return {
          ...t,
          payments,
          totalPaid,
          remainingAmount,
        };
      })
    );

    const totalTrosa = await db
      .select({ value: count() })
      .from(trosa)
      .where(and(...whereClauses));

    return NextResponse.json({
      trosa: trosaWithPayments,
      totalTrosa: totalTrosa[0].value,
    });
  } catch (error) {
    console.error("Error fetching trosa:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { description, montantTotal } = body;

    if (!description || !montantTotal) {
      return NextResponse.json(
        { message: "Tous les champs requis ne sont pas fournis" },
        { status: 400 },
      );
    }

    if (parseFloat(montantTotal) <= 0) {
      return NextResponse.json(
        { message: "Le montant total doit être supérieur à 0" },
        { status: 400 },
      );
    }

    await db.insert(trosa).values({
      userId: Number(userId),
      description: description,
      montantTotal: montantTotal.toString(),
      isPaid: false,
    });

    return NextResponse.json(
      { message: "Trosa ajouté avec succès" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding trosa:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID du trosa manquant" },
        { status: 400 },
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { description, montantTotal } = body;

    if (!description || !montantTotal) {
      return NextResponse.json(
        { message: "Tous les champs requis ne sont pas fournis" },
        { status: 400 },
      );
    }

    if (parseFloat(montantTotal) <= 0) {
      return NextResponse.json(
        { message: "Le montant total doit être supérieur à 0" },
        { status: 400 },
      );
    }

    await db
      .update(trosa)
      .set({
        description,
        montantTotal: montantTotal.toString(),
      })
      .where(
        and(
          eq(trosa.id, parseInt(id)),
          eq(trosa.userId, Number(userId)),
        ),
      );

    return NextResponse.json(
      { message: "Trosa mis à jour avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating trosa:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID du trosa manquant" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Supprimer d'abord tous les paiements associés
    await db
      .delete(trosaPayments)
      .where(eq(trosaPayments.trosaId, parseInt(id)));

    // Puis supprimer le trosa
    await db
      .delete(trosa)
      .where(
        and(
          eq(trosa.id, parseInt(id)),
          eq(trosa.userId, Number(userId)),
        ),
      );

    return NextResponse.json(
      { message: "Trosa supprimé avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting trosa:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}