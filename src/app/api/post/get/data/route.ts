import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const encodedPosts = await posts.map((post) => {
      const encodedName = btoa(btoa(post.user.name));
      return {
        ...post,
        user: {
          ...post.user,
          name: encodedName,
        },
      };
    });
    return NextResponse.json({ success: true, posts: encodedPosts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
