import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/prismaConifg";

const res = NextResponse;

export async function POST(request: NextRequest) {
  const { email, title, content, isChecked, image, concern } =
    await request.json();
  let validateImg = null;
  try {
    if (image !== null) {
      validateImg = image;
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      await prisma.post.create({
        data: {
          content: content,
          concern: concern,
          isChecked: isChecked,
          title: title,
          userId: await user.id,
          image: validateImg,
        },
      });
    }

    return res.json({
      success: true,
      message: "Successfully Posted",
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Failed To Post" });
  }
}
