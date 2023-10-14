import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  const { formData, email } = await request.json();

  try {
    if (formData.title && formData.content && formData.content) {
      //check user if existing
      const user = await prisma.user.findFirst({
        where: {
          id: formData.userId,
        },
      });

      //update the post
      if (user) {
        const updatePost = await prisma.post.update({
          where: {
            id: formData.id,
          },
          data: {
            content: formData.content,
            concern: formData.concern,
            isChecked: formData.isChecked,
            title: formData.title,
            userId: user.id,
            image: formData.image,
          },
        });

        if (updatePost) {
          return NextResponse.json({ success: true });
        }
      }
    }
  } catch (err) {
    return NextResponse.json({ success: false });
  }
}
