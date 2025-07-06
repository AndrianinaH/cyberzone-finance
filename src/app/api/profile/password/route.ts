import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, comparePassword, hashPassword } from "@/lib/auth";
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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse(
        "Le mot de passe actuel et le nouveau mot de passe sont requis",
        { status: 400 },
      );
    }

    const userId = session.user.id;

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(userId)),
    });

    if (!user) {
      return new NextResponse("Utilisateur introuvable", { status: 404 });
    }

    const passwordMatch = await comparePassword(currentPassword, user.password);

    if (!passwordMatch) {
      return new NextResponse("Mot de passe actuel invalide", { status: 401 });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedNewPassword,
      })
      .where(eq(users.id, Number(userId)));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
