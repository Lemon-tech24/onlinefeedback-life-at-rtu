import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  const { postId, userId } = await request.json();
  try {
    const seen = await prisma.seen.create({
      data: {
        postId: postId,
        userId: userId,
      },
    });

    if (seen) {
      return NextResponse.json({ sucess: true });
    } else {
      return NextResponse.json({
        success: false,
        message: "error occured in query",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
