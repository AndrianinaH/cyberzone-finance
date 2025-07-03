import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "../../../../../drizzle/schema";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
    console.log("🚀 ~ newUser ~ newUser:", newUser);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
