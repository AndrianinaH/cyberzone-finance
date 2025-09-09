import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { trosa } from "@/drizzle/schema";
import { eq, ilike, desc, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const userId = Number(session.user.id);

    let debtors;

    if (query) {
      // Rechercher les débiteurs par nom (partiellement)
      debtors = await db
        .selectDistinct({ name: trosa.debtorName })
        .from(trosa)
        .where(
          and(
            eq(trosa.userId, userId),
            ilike(trosa.debtorName, `%${query}%`)
          )
        )
        .orderBy(desc(trosa.createdAt))
        .limit(10);
    } else {
      // Retourner les 10 débiteurs les plus récents
      debtors = await db
        .selectDistinct({ name: trosa.debtorName })
        .from(trosa)
        .where(eq(trosa.userId, userId))
        .orderBy(desc(trosa.createdAt))
        .limit(10);
    }

    // Extraire juste les noms pour l'auto-complétion
    const debtorNames = debtors.map(debtor => debtor.name);

    return NextResponse.json({ debtors: debtorNames });
  } catch (error) {
    console.error("Error fetching debtors:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}