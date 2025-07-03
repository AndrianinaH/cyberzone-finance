import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, comparePassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Current and new passwords are required", {
        status: 400,
      });
    }

    const userId = session.user.id;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const passwordMatch = await comparePassword(currentPassword, user.password);

    if (!passwordMatch) {
      return new NextResponse("Invalid current password", { status: 401 });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedNewPassword,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
