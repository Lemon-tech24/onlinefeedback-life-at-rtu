import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  const { content, postId, userId } = await request.json();
  try {
    const addComent = await prisma.comment.create({
      data: {
        content: content,
        post: {
          connect: { id: postId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    if (addComent) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
