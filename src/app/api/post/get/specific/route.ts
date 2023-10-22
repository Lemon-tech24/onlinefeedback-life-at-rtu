import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  try {
    if (postId) {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post) {
        return NextResponse.json({ success: true, post });
      } else {
        return NextResponse.json({ success: false });
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
