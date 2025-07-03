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
