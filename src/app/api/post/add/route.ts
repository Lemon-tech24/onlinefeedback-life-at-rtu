import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/prismaConfig";

export async function POST(request: NextRequest) {
  const { formData } = await request.json();

  if (formData.title && formData.content && formData.concern) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: formData.email,
        },
      });

      if (user) {
        await prisma.post.create({
          data: {
            content: formData.content,
            concern: formData.concern,
            isChecked: formData.isChecked,
            title: formData.title,
            userId: user.id,
            image: formData.image,
          },
        });
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "User not found" });
      }
    } catch (err) {
      console.error(err);
      return NextResponse.json({ success: false, error: "An error occurred" });
    }
  } else {
    return NextResponse.json({ success: false, error: "Missing data" });
  }
}
