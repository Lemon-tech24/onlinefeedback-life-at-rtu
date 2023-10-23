import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";
import { comment } from "postcss";

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  try {
    const comments = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        comments: {
          select: {
            content: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (comments) {
      return NextResponse.json(comments);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
