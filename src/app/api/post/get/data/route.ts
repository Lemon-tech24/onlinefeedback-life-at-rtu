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
        comments: true,

        likes: true,
        reports: true,
      },
    });

    if (posts) {
      const encodedPosts = posts.map((post) => {
        if (post.user) {
          const encodedName = btoa(btoa(post.user.name));
          return {
            ...post,
            user: {
              ...post.user,
              name: encodedName,
            },
            comments: post.comments.length,

            countlikes: post.likes.length,
            countreports: post.reports.length,
          };
        } else {
          return post;
        }
      });
      return NextResponse.json({ success: true, posts: encodedPosts });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
