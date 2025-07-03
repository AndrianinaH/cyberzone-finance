import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return new NextResponse("Name and email are required", { status: 400 });
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
      existingUserWithEmail[0].id !== userId
    ) {
      return new NextResponse("Email already in use", { status: 409 });
    }

    await db
      .update(users)
      .set({
        name: name,
        email: email,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
