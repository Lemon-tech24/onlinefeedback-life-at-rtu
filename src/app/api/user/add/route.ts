import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createPool } from "@vercel/postgres";
const db = createPool();
const res = NextResponse;

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    await db.connect();

    await db.query(
      `INSERT INTO users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING;`,
      [email, name]
    );
    return res.json({ added: true, email, name });
  } catch (err) {
    return res.json({ added: false });
  }
}
