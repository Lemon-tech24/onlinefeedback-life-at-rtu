import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  try {
    const { postId, userId, reason } = await request.json();

    const report = await prisma.report.create({
      data: {
        postId: postId,
        userId: userId,
        reason: reason,
      },
    });

    if (report) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Failed To Report" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "something went wrong",
    });
  }
}
