import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return new NextResponse("Le nom et l'email sont requis", { status: 400 });
    }

    const userId = session.user.id;

    // Check if email already exists for another user
    const existingUserWithEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    if (
      existingUserWithEmail.length > 0 &&
      String(existingUserWithEmail[0].id) !== String(userId)
    ) {
      return new NextResponse("Cet email est déjà utilisé", { status: 409 });
    }

    await db
      .update(users)
      .set({
        name: name,
        email: email,
      })
      .where(eq(users.id, Number(userId)));

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
