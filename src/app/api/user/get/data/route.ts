import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";
const res = NextResponse;

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json({ success: true, userId: user.id });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
