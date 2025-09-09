import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { trosa, trosaPayments } from "@/drizzle/schema";
import { and, eq, desc } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    const trosaId = parseInt(id);
    const userId = Number(session.user.id);

    // Vérifier que le trosa appartient à l'utilisateur connecté
    const trosaRecord = await db
      .select()
      .from(trosa)
      .where(and(eq(trosa.id, trosaId), eq(trosa.userId, userId)))
      .limit(1);

    if (trosaRecord.length === 0) {
      return NextResponse.json(
        { message: "Trosa non trouvé" },
        { status: 404 },
      );
    }

    const payments = await db
      .select()
      .from(trosaPayments)
      .where(eq(trosaPayments.trosaId, trosaId))
      .orderBy(desc(trosaPayments.datePaiement));

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    const trosaId = parseInt(id);
    const userId = Number(session.user.id);
    const body = await req.json();
    const { montant, datePaiement, description } = body;

    if (!montant || !datePaiement) {
      return NextResponse.json(
        { message: "Montant et date de paiement requis" },
        { status: 400 },
      );
    }

    if (parseFloat(montant) <= 0) {
      return NextResponse.json(
        { message: "Le montant doit être supérieur à 0" },
        { status: 400 },
      );
    }

    // Vérifier que le trosa appartient à l'utilisateur connecté
    const trosaRecord = await db
      .select()
      .from(trosa)
      .where(and(eq(trosa.id, trosaId), eq(trosa.userId, userId)))
      .limit(1);

    if (trosaRecord.length === 0) {
      return NextResponse.json(
        { message: "Trosa non trouvé" },
        { status: 404 },
      );
    }

    const currentTrosa = trosaRecord[0];

    // Vérifier que le trosa n'est pas déjà entièrement payé
    if (currentTrosa.isPaid) {
      return NextResponse.json(
        { message: "Ce trosa est déjà entièrement payé" },
        { status: 400 },
      );
    }

    // Calculer le total déjà payé
    const existingPayments = await db
      .select()
      .from(trosaPayments)
      .where(eq(trosaPayments.trosaId, trosaId));

    const totalPaid = existingPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.montant),
      0
    );

    const newTotal = totalPaid + parseFloat(montant);
    const montantTotal = parseFloat(currentTrosa.montantTotal);

    // Vérifier que le nouveau paiement ne dépasse pas le montant total
    if (newTotal > montantTotal) {
      return NextResponse.json(
        { 
          message: `Le paiement de ${montant} MGA dépasse le montant restant (${montantTotal - totalPaid} MGA)` 
        },
        { status: 400 },
      );
    }

    // Ajouter le paiement
    await db.insert(trosaPayments).values({
      trosaId: trosaId,
      montant: montant.toString(),
      datePaiement: new Date(datePaiement),
      description: description || null,
    });

    // Vérifier si le trosa est maintenant entièrement payé
    if (newTotal >= montantTotal) {
      await db
        .update(trosa)
        .set({
          isPaid: true,
          datePaiement: new Date(),
        })
        .where(eq(trosa.id, trosaId));
    }

    return NextResponse.json(
      { 
        message: newTotal >= montantTotal 
          ? "Paiement ajouté avec succès. Trosa entièrement payé !"
          : "Paiement ajouté avec succès" 
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding payment:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    const trosaId = parseInt(id);
    const userId = Number(session.user.id);
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { message: "ID du paiement manquant" },
        { status: 400 },
      );
    }

    // Vérifier que le trosa appartient à l'utilisateur connecté
    const trosaRecord = await db
      .select()
      .from(trosa)
      .where(and(eq(trosa.id, trosaId), eq(trosa.userId, userId)))
      .limit(1);

    if (trosaRecord.length === 0) {
      return NextResponse.json(
        { message: "Trosa non trouvé" },
        { status: 404 },
      );
    }

    // Supprimer le paiement
    await db
      .delete(trosaPayments)
      .where(
        and(
          eq(trosaPayments.id, parseInt(paymentId)),
          eq(trosaPayments.trosaId, trosaId)
        )
      );

    // Recalculer le statut du trosa
    const remainingPayments = await db
      .select()
      .from(trosaPayments)
      .where(eq(trosaPayments.trosaId, trosaId));

    const totalPaid = remainingPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.montant),
      0
    );

    const montantTotal = parseFloat(trosaRecord[0].montantTotal);

    // Mettre à jour le statut si nécessaire
    if (totalPaid < montantTotal && trosaRecord[0].isPaid) {
      await db
        .update(trosa)
        .set({
          isPaid: false,
          datePaiement: null,
        })
        .where(eq(trosa.id, trosaId));
    }

    return NextResponse.json(
      { message: "Paiement supprimé avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}