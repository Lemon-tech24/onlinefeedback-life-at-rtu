import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/prismaConifg";

export async function POST(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
    });
    return Promise.resolve(NextResponse.json(posts));
  } catch (error) {
    console.error(error);
    return Promise.resolve(
      new Response("Internal Server Error", { status: 500 })
    );
  }
}
