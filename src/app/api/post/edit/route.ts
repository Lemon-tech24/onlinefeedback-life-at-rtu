import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/prismaConifg";

const res = NextResponse;

export async function POST(request: NextRequest) {
  const { id, image, title, content, isChecked, concern } =
    await request.json();

  try {
    const edit = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        image: image,
        title: title,
        content: content,
        isChecked: isChecked,
        concern: concern,
      },
    });

    if (edit) {
      return res.json({ success: true, msg: "Post Edited Successfully" });
    } else {
      return res.json({ success: false, msg: "Failed to Edit" });
    }
  } catch (err) {
    console.log("Edit Failed", err);
  }
}
