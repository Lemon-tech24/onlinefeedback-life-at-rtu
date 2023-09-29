import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/prismaConifg"; // Assuming you have correctly imported your Prisma instance
const res = NextResponse;

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Check if the email already exists in the User model
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      // If the email doesn't exist, create a new user
      await prisma.user.create({
        data: {
          name: name,
          email: email,
        },
      });
      return res.json({ added: true, email, name });
    } else {
      return res.json({
        added: false,
        message: "User with this email already exists",
      });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    return res.json({ added: false });
  }
}
