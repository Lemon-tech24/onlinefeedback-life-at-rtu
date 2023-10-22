import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  try {
    const selected = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (selected) {
      const deletePost = await prisma.post.delete({
        where: {
          id: selected.id,
        },
      });

      if (deletePost) {
        return NextResponse.json({ success: true });
      }

      return NextResponse.json({ success: false });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    console.error(err);

    return NextResponse.json({ success: false });
  }
}
