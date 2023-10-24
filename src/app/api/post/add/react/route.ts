import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  const { postId, userId } = await request.json();
  try {
    const likeExists = await prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (likeExists) {
      const deleteLikes = await prisma.like.deleteMany({
        where: {
          postId: postId,
          userId: userId,
        },
      });
      console.log("Like Removed");
      return NextResponse.json({ success: true });
    } else {
      const newLike = await prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
      console.log("New like added.");
      return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
