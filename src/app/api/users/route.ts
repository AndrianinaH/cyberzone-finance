import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const allUsers = await db
      .select({ id: users.id, name: users.name })
      .from(users);

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
